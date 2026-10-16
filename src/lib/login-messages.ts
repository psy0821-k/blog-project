const ACCESS_DENIED_MESSAGE = '관리자로 등록된 Google 계정만 로그인할 수 있습니다. 다른 계정으로 시도해 주세요.'
const DEFAULT_ERROR_MESSAGE = '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'

/**
 * Auth.js가 로그인 화면에 붙이는 `?error=` 코드를 사용자에게 보여 줄 한국어 문구로 바꾼다.
 * 코드 문자열은 화면에 그대로 노출하지 않는다. 코드가 없으면 오류가 없는 것이므로 null.
 */
export function getLoginErrorMessage(errorCode: string | undefined): string | null {
  if (!errorCode) {
    return null
  }

  return errorCode === 'AccessDenied' ? ACCESS_DENIED_MESSAGE : DEFAULT_ERROR_MESSAGE
}
