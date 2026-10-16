import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const requireAdminSession = vi.fn()
const issueAdminToken = vi.fn()

vi.mock('@/lib/api-auth', () => ({
  requireAdminSession: () => requireAdminSession(),
  issueAdminToken: (subject: string) => issueAdminToken(subject),
}))

import { GET } from './route'

const ADMIN_APP_ORIGIN = 'http://localhost:5173'
const CALLBACK = `${ADMIN_APP_ORIGIN}/auth/callback`

function request(redirect?: string) {
  const url = new URL('http://localhost:3000/admin-login')

  if (redirect !== undefined) {
    url.searchParams.set('redirect', redirect)
  }

  return new NextRequest(url)
}

describe('GET /admin-login', () => {
  beforeEach(() => {
    process.env.ADMIN_APP_ORIGIN = ADMIN_APP_ORIGIN
    issueAdminToken.mockResolvedValue('signed.jwt.token')
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete process.env.ADMIN_APP_ORIGIN
  })

  it('ADMIN 세션이면 토큰을 해시로 붙여 관리 앱 콜백으로 보낸다', async () => {
    requireAdminSession.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })

    const response = await GET(request(CALLBACK))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${CALLBACK}#token=signed.jwt.token`)
    expect(issueAdminToken).toHaveBeenCalledWith('admin-1')
  })

  it('토큰이 담긴 응답은 캐시하지 않는다', async () => {
    requireAdminSession.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })

    const response = await GET(request(CALLBACK))

    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('세션이 없으면 로그인 후 이 주소로 돌아오도록 /admin/login으로 보낸다', async () => {
    requireAdminSession.mockResolvedValue(null)

    const response = await GET(request(CALLBACK))
    const location = new URL(response.headers.get('location') ?? '')
    const returnTo = location.searchParams.get('redirectTo') ?? ''

    expect(location.pathname).toBe('/admin/login')
    expect(returnTo).toBe(`/admin-login?redirect=${encodeURIComponent(CALLBACK)}`)
    expect(issueAdminToken).not.toHaveBeenCalled()
  })

  it('redirect 오리진이 허용 오리진과 다르면 400이고 토큰을 발급하지 않는다', async () => {
    requireAdminSession.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } })

    const response = await GET(request('https://evil.example/auth/callback'))

    expect(response.status).toBe(400)
    expect(response.headers.get('location')).toBeNull()
    expect(issueAdminToken).not.toHaveBeenCalled()
  })

  it('redirect가 없으면 400이다', async () => {
    const response = await GET(request())

    expect(response.status).toBe(400)
  })

  it('ADMIN_APP_ORIGIN이 설정되지 않았으면 400이다', async () => {
    delete process.env.ADMIN_APP_ORIGIN

    const response = await GET(request(CALLBACK))

    expect(response.status).toBe(400)
  })
})
