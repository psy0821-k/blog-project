import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { signOut } from '@/auth'
import { resolveAdminAppRedirect } from '@/lib/admin-login-redirect'
import { badRequestResponse } from '@/lib/api-response'

/**
 * 관리자(ERP) 앱 로그아웃 진입점.
 * 관리 앱의 토큰만 지우면 블로그 세션이 남아 다시 들어올 때 바로 재로그인되므로,
 * 브라우저를 이 주소로 보내 블로그 세션(쿠키)까지 지운 뒤 `redirect`로 되돌려 보낸다.
 *
 * redirect가 ADMIN_APP_ORIGIN과 다르면 로그아웃하지 않고 400을 돌려준다(오픈 리디렉트 방지).
 */
export async function GET(request: NextRequest) {
  const redirect = resolveAdminAppRedirect(
    request.nextUrl.searchParams.get('redirect'),
    process.env.ADMIN_APP_ORIGIN,
  )

  if (!redirect) {
    return badRequestResponse('Invalid redirect')
  }

  await signOut({ redirect: false })

  return NextResponse.redirect(redirect)
}
