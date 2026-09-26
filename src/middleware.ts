import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 관리자(ERP) 앱은 완전히 다른 도메인/포트에서 뜨는 별도 리액트 프로젝트라,
 * 브라우저가 같은 오리진이 아닌 API 요청을 기본적으로 차단한다(CORS).
 * `/api/*` 요청에 한해 ADMIN_APP_ORIGIN만 명시적으로 허용한다.
 *
 * 인증 자체는 여기서 처리하지 않는다 — 각 라우트가 requireAdminSession/requireAdminToken으로
 * 별도 검증한다. 이 미들웨어는 오리진 허용 여부만 다룬다.
 */
function applyCorsHeaders(response: NextResponse, origin: string | null) {
  const allowedOrigin = process.env.ADMIN_APP_ORIGIN

  if (!allowedOrigin || origin !== allowedOrigin) {
    return response
  }

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')

  // 브라우저가 실제 요청 전에 보내는 preflight 요청. 여기서 바로 CORS 헤더만 붙여 응답한다.
  if (request.method === 'OPTIONS') {
    return applyCorsHeaders(new NextResponse(null, { status: 204 }), origin)
  }

  return applyCorsHeaders(NextResponse.next(), origin)
}

export const config = {
  matcher: '/api/:path*',
}
