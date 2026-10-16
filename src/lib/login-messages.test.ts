import { describe, expect, it } from 'vitest'
import { getLoginErrorMessage } from './login-messages'

describe('getLoginErrorMessage', () => {
  it('에러 코드가 없으면 null이다', () => {
    expect(getLoginErrorMessage(undefined)).toBeNull()
    expect(getLoginErrorMessage('')).toBeNull()
  })

  it('허용되지 않은 계정(AccessDenied)이면 계정 안내 문구를 돌려준다', () => {
    expect(getLoginErrorMessage('AccessDenied')).toBe('관리자로 등록된 Google 계정만 로그인할 수 있습니다. 다른 계정으로 시도해 주세요.')
  })

  it('알 수 없는 코드여도 일반 안내 문구를 돌려준다', () => {
    expect(getLoginErrorMessage('Configuration')).toBe('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    expect(getLoginErrorMessage('Whatever')).toBe('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
  })

  it('코드 문자열을 문구에 그대로 노출하지 않는다', () => {
    expect(getLoginErrorMessage('<script>alert(1)</script>')).not.toContain('<script>')
  })
})
