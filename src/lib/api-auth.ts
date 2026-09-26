import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * 요청자가 ADMIN 권한을 가진 세션인지 확인한다.
 * ADMIN이 아니면 null을 반환하므로, 호출부에서 null이면 forbiddenResponse()를 반환한다.
 */
export async function requireAdminSession() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return session
}

/**
 * 관리자(ERP) 앱 전용 API 토큰의 payload.
 * 블로그(Next.js)와 관리자 앱이 서로 다른 오리진이라 쿠키 세션을 공유할 수 없어,
 * `/api/admin/token`에서 발급하는 별도 JWT로 인증한다.
 */
export interface AdminTokenPayload {
  sub: string
  role: 'ADMIN'
}

export function getAdminTokenSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error('AUTH_SECRET 환경 변수가 설정되어 있지 않습니다.')
  }

  return new TextEncoder().encode(secret)
}

/**
 * 관리자 앱이 보낸 `Authorization: Bearer <token>` 헤더를 검증한다.
 * 세션 쿠키 대신 토큰으로 인증하는 요청(다른 오리진에서 오는 관리자 앱)에 사용한다.
 * 유효하지 않으면 null을 반환하므로, 호출부에서 null이면 forbiddenResponse()를 반환한다.
 */
export async function requireAdminToken(request: NextRequest): Promise<AdminTokenPayload | null> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const { payload } = await jwtVerify(token, getAdminTokenSecret())

    if (payload.role !== 'ADMIN' || typeof payload.sub !== 'string') {
      return null
    }

    return { sub: payload.sub, role: 'ADMIN' }
  } catch {
    return null
  }
}

/**
 * ADMIN 요청자를 세션 쿠키(블로그 자체 로그인) 또는 Authorization 헤더 토큰(관리자 앱)
 * 어느 쪽으로 왔든 동일한 형태({ userId })로 반환한다.
 * 라우트 핸들러는 인증 수단을 신경 쓰지 않고 이 함수 하나만 호출하면 된다.
 */
export async function requireAdmin(request: NextRequest): Promise<{ userId: string } | null> {
  const session = await requireAdminSession()

  if (session) {
    return { userId: session.user.id }
  }

  const tokenPayload = await requireAdminToken(request)

  if (tokenPayload) {
    return { userId: tokenPayload.sub }
  }

  return null
}
