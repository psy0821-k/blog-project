import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const signOut = vi.fn()

vi.mock('@/auth', () => ({
  signOut: (options: unknown) => signOut(options),
}))

import { GET } from './route'

const ADMIN_APP_ORIGIN = 'http://localhost:5173'
const LOGGED_OUT_URL = `${ADMIN_APP_ORIGIN}/login?loggedOut=1`

function request(redirect?: string) {
  const url = new URL('http://localhost:3000/admin-logout')

  if (redirect !== undefined) {
    url.searchParams.set('redirect', redirect)
  }

  return new NextRequest(url)
}

describe('GET /admin-logout', () => {
  beforeEach(() => {
    process.env.ADMIN_APP_ORIGIN = ADMIN_APP_ORIGIN
    signOut.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete process.env.ADMIN_APP_ORIGIN
  })

  it('블로그 세션을 로그아웃하고 관리 앱 주소로 돌려보낸다', async () => {
    const response = await GET(request(LOGGED_OUT_URL))

    expect(signOut).toHaveBeenCalledWith({ redirect: false })
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(LOGGED_OUT_URL)
  })

  it('redirect 오리진이 허용 오리진과 다르면 400이고 로그아웃하지 않는다', async () => {
    const response = await GET(request('https://evil.example/login'))

    expect(response.status).toBe(400)
    expect(response.headers.get('location')).toBeNull()
    expect(signOut).not.toHaveBeenCalled()
  })

  it('redirect가 없으면 400이고 로그아웃하지 않는다', async () => {
    const response = await GET(request())

    expect(response.status).toBe(400)
    expect(signOut).not.toHaveBeenCalled()
  })

  it('ADMIN_APP_ORIGIN이 설정되지 않았으면 400이다', async () => {
    delete process.env.ADMIN_APP_ORIGIN

    const response = await GET(request(LOGGED_OUT_URL))

    expect(response.status).toBe(400)
    expect(signOut).not.toHaveBeenCalled()
  })
})
