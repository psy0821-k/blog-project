/**
 * 관리자 앱 로그인 리디렉션(/admin-login)에서 쓰는 주소 검증·조립 함수.
 * 토큰을 엉뚱한 곳으로 보내는 오픈 리디렉트를 막는 것이 목적이라, 의심스러우면 null/"/"를 돌려준다.
 */

function parseHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

/**
 * redirect의 오리진이 허용된 관리자 앱 오리진과 완전히 같을 때만 그 주소(해시 제거)를 돌려준다.
 * 문자열 접두사 비교가 아니라 파싱한 오리진끼리 비교해 `localhost:5173.evil.example` 같은 우회를 막는다.
 */
export function resolveAdminAppRedirect(
  redirect: string | null | undefined,
  allowedOrigin: string | undefined,
): string | null {
  if (!redirect || !allowedOrigin) {
    return null
  }

  const target = parseHttpUrl(redirect)
  const allowed = parseHttpUrl(allowedOrigin)

  if (!target || !allowed || target.origin !== allowed.origin) {
    return null
  }

  target.hash = ''
  return target.toString()
}

/** 토큰은 서버 로그와 Referer에 남지 않도록 쿼리스트링이 아닌 해시로 전달한다. */
export function buildTokenRedirectUrl(callbackUrl: string, token: string): string {
  return `${callbackUrl}#token=${encodeURIComponent(token)}`
}

/** 로그인 후 돌아갈 곳은 이 사이트 안의 경로만 허용한다. 그 외에는 "/"로 대체한다. */
export function sanitizeInternalPath(path: string | null | undefined): string {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return '/'
  }

  return path
}
