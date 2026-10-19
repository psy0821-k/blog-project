import { SignJWT } from 'jose'
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findUnique: vi.fn(),
  deletePost: vi.fn(),
  updatePost: vi.fn(),
  deleteUnreferencedMediaFiles: vi.fn(),
}))

// 쿠키 세션은 없는 상태(관리 앱처럼 다른 오리진에서 오는 요청)를 기본으로 한다.
vi.mock('@/auth', () => ({ auth: mocks.auth }))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    post: { findUnique: mocks.findUnique, delete: mocks.deletePost },
    $transaction: async (callback: (tx: unknown) => unknown) =>
      callback({
        post: { update: mocks.updatePost },
        media: { deleteMany: vi.fn(), createMany: vi.fn() },
      }),
  },
  isRecordNotFoundError: () => false,
}))

vi.mock('@/lib/category', () => ({ validateCategoryForType: async () => null }))
vi.mock('@/lib/tag', () => ({ replacePostTags: vi.fn() }))
vi.mock('@/lib/post-detail', () => ({ getPublishedPostBySlug: vi.fn() }))
vi.mock('@/lib/post-media-cleanup', () => ({
  collectPostMediaUrls: async () => [],
  deleteUnreferencedMediaFiles: mocks.deleteUnreferencedMediaFiles,
}))

import { DELETE, PATCH } from './route'

// 테스트 전용 가짜 비밀 값. 실제 AUTH_SECRET이 아니다.
const TEST_SECRET = 'test-only-secret-not-a-real-auth-secret'
const SLUG = 'my-lab-post'
const LAB_POST = { id: 'post-1', slug: SLUG, type: 'LAB', published: false }

async function createToken({ role = 'ADMIN', expiresIn = '1h' }: { role?: string; expiresIn?: string } = {}) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('admin-1')
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(TEST_SECRET))
}

function request(method: 'PATCH' | 'DELETE', { token, body }: { token?: string; body?: unknown } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json' }

  if (token) {
    headers.authorization = `Bearer ${token}`
  }

  return new NextRequest(`http://localhost:3000/api/lab/${SLUG}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

const routeParams = { params: Promise.resolve({ slug: SLUG }) }

describe('랩 글 PATCH/DELETE 인증', () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = TEST_SECRET
    mocks.auth.mockResolvedValue(null)
    mocks.findUnique.mockResolvedValue(LAB_POST)
    mocks.updatePost.mockResolvedValue({ ...LAB_POST, published: true })
    mocks.deletePost.mockResolvedValue(LAB_POST)
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete process.env.AUTH_SECRET
  })

  describe('PATCH', () => {
    it('관리 앱의 ADMIN 토큰(Bearer)이면 세션 없이도 발행 상태를 바꾼다', async () => {
      const response = await PATCH(request('PATCH', { token: await createToken(), body: { published: true } }), routeParams)

      expect(response.status).toBe(200)
      expect(mocks.updatePost).toHaveBeenCalledWith({ where: { id: LAB_POST.id }, data: { published: true } })
    })

    it('블로그 ADMIN 세션(쿠키)이면 토큰 없이도 바꾼다', async () => {
      mocks.auth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })

      const response = await PATCH(request('PATCH', { body: { published: true } }), routeParams)

      expect(response.status).toBe(200)
    })

    it('세션도 토큰도 없으면 403이고 DB를 건드리지 않는다', async () => {
      const response = await PATCH(request('PATCH', { body: { published: true } }), routeParams)

      expect(response.status).toBe(403)
      expect(mocks.findUnique).not.toHaveBeenCalled()
      expect(mocks.updatePost).not.toHaveBeenCalled()
    })

    it('ADMIN이 아닌 역할의 토큰이면 403이다', async () => {
      const response = await PATCH(
        request('PATCH', { token: await createToken({ role: 'USER' }), body: { published: true } }),
        routeParams,
      )

      expect(response.status).toBe(403)
      expect(mocks.updatePost).not.toHaveBeenCalled()
    })

    it('만료됐거나 서명이 틀린 토큰이면 403이다', async () => {
      const expired = await createToken({ expiresIn: '-1h' })

      expect((await PATCH(request('PATCH', { token: expired, body: { published: true } }), routeParams)).status).toBe(403)
      expect((await PATCH(request('PATCH', { token: 'not.a.jwt', body: { published: true } }), routeParams)).status).toBe(403)
      expect(mocks.updatePost).not.toHaveBeenCalled()
    })

    it('토큰이 유효해도 랩이 아닌 글(slug)이면 404이다', async () => {
      mocks.findUnique.mockResolvedValue({ ...LAB_POST, type: 'PROJECT' })

      const response = await PATCH(request('PATCH', { token: await createToken(), body: { published: true } }), routeParams)

      expect(response.status).toBe(404)
      expect(mocks.updatePost).not.toHaveBeenCalled()
    })

    it('토큰이 유효해도 본문이 올바르지 않으면 400이다', async () => {
      const response = await PATCH(request('PATCH', { token: await createToken(), body: { published: 'yes' } }), routeParams)

      expect(response.status).toBe(400)
      expect(mocks.updatePost).not.toHaveBeenCalled()
    })
  })

  describe('DELETE', () => {
    it('관리 앱의 ADMIN 토큰(Bearer)이면 세션 없이도 글을 삭제하고 204를 돌려준다', async () => {
      const response = await DELETE(request('DELETE', { token: await createToken() }), routeParams)

      expect(response.status).toBe(204)
      expect(mocks.deletePost).toHaveBeenCalledWith({ where: { id: LAB_POST.id } })
      expect(mocks.deleteUnreferencedMediaFiles).toHaveBeenCalled()
    })

    it('블로그 ADMIN 세션(쿠키)이면 토큰 없이도 삭제한다', async () => {
      mocks.auth.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })

      const response = await DELETE(request('DELETE'), routeParams)

      expect(response.status).toBe(204)
    })

    it('세션도 토큰도 없으면 403이고 아무것도 삭제하지 않는다', async () => {
      const response = await DELETE(request('DELETE'), routeParams)

      expect(response.status).toBe(403)
      expect(mocks.deletePost).not.toHaveBeenCalled()
      expect(mocks.deleteUnreferencedMediaFiles).not.toHaveBeenCalled()
    })

    it('ADMIN이 아닌 역할의 토큰이면 403이다', async () => {
      const response = await DELETE(request('DELETE', { token: await createToken({ role: 'USER' }) }), routeParams)

      expect(response.status).toBe(403)
      expect(mocks.deletePost).not.toHaveBeenCalled()
    })

    it('이미 지워졌거나 랩이 아닌 글이면 404이고 삭제하지 않는다', async () => {
      mocks.findUnique.mockResolvedValue(null)

      const response = await DELETE(request('DELETE', { token: await createToken() }), routeParams)

      expect(response.status).toBe(404)
      expect(mocks.deletePost).not.toHaveBeenCalled()
    })
  })
})
