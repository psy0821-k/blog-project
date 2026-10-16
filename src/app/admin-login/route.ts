import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { issueAdminToken, requireAdminSession } from '@/lib/api-auth'
import { buildTokenRedirectUrl, resolveAdminAppRedirect } from '@/lib/admin-login-redirect'
import { badRequestResponse } from '@/lib/api-response'

/**
 * 관리자(ERP) 앱 로그인 진입점.
 * 관리자 앱은 다른 오리진이라 세션 쿠키를 쓸 수 없으므로, 브라우저를 이 주소로 보내
 * ADMIN 세션을 확인한 뒤 `redirect#token=<JWT>`로 되돌려 보낸다.
 *
 * - redirect가 ADMIN_APP_ORIGIN과 다르면 토큰을 발급하지 않고 400을 돌려준다(오픈 리디렉트 방지).
 * - 세션이 없으면 Google 로그인(/admin/login)을 거쳐 이 주소로 돌아온다.
 */
export async function GET(request: NextRequest) {
  const redirect = resolveAdminAppRedirect(
    request.nextUrl.searchParams.get('redirect'),
    process.env.ADMIN_APP_ORIGIN,
  )

  if (!redirect) {
    return badRequestResponse('Invalid redirect')
  }

  const session = await requireAdminSession()

  if (!session) {
    const returnTo = `/admin-login?redirect=${encodeURIComponent(redirect)}`
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirectTo', returnTo)

    return NextResponse.redirect(loginUrl)
  }

  const token = await issueAdminToken(session.user.id)
  const response = NextResponse.redirect(buildTokenRedirectUrl(redirect, token))
  // 토큰이 담긴 리디렉션이 중간 캐시에 남지 않게 한다.
  response.headers.set('Cache-Control', 'no-store')

  return response
}
