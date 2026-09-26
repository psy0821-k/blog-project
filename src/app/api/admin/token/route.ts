import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'
import { forbiddenResponse } from '@/lib/api-response'
import { getAdminTokenSecret, requireAdminSession } from '@/lib/api-auth'

// 관리자(ERP) 앱용 API 토큰의 유효 기간. 만료되면 관리자 앱에서 이 엔드포인트를 다시 호출해 재발급받는다.
const ADMIN_TOKEN_EXPIRES_IN = '1h'

/**
 * 블로그(Next.js)에 Google OAuth로 로그인된 ADMIN 세션(쿠키)을 확인한 뒤,
 * 다른 오리진의 관리자(ERP) 앱이 API 호출에 사용할 수 있는 JWT를 발급한다.
 *
 * 사용 흐름:
 * 1. 관리자 앱이 사용자를 블로그의 Google 로그인 페이지(/login)로 보낸다.
 * 2. 로그인 완료 후(같은 오리진이므로 세션 쿠키가 존재) 관리자 앱이 이 엔드포인트를 호출한다.
 * 3. 응답으로 받은 토큰을 관리자 앱이 저장하고, 이후 모든 API 요청에
 *    `Authorization: Bearer <token>` 헤더로 실어 보낸다.
 */
export async function GET() {
  const session = await requireAdminSession()

  if (!session) {
    return forbiddenResponse()
  }

  const token = await new SignJWT({ role: 'ADMIN' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime(ADMIN_TOKEN_EXPIRES_IN)
    .sign(getAdminTokenSecret())

  return NextResponse.json({ token, expiresIn: ADMIN_TOKEN_EXPIRES_IN })
}
