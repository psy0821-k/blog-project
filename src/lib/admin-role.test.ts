import { describe, expect, it } from 'vitest'
import { resolveRoleByEmail } from './admin-role'

describe('resolveRoleByEmail', () => {
  it('운영자 이메일과 같으면 ADMIN이다', () => {
    expect(resolveRoleByEmail('me@example.com', 'me@example.com')).toBe('ADMIN')
  })

  it('대소문자와 앞뒤 공백은 무시하고 비교한다', () => {
    expect(resolveRoleByEmail('Me@Example.com', ' me@example.com ')).toBe('ADMIN')
  })

  it('다른 이메일이면 USER이다', () => {
    expect(resolveRoleByEmail('other@example.com', 'me@example.com')).toBe('USER')
  })

  it('운영자 이메일이 설정되지 않았으면 USER이다', () => {
    expect(resolveRoleByEmail('me@example.com', undefined)).toBe('USER')
    expect(resolveRoleByEmail('me@example.com', '')).toBe('USER')
  })
})
