import { describe, expect, it } from 'vitest'
import {
  buildTokenRedirectUrl,
  resolveAdminAppRedirect,
  resolveLoginDestination,
  sanitizeInternalPath,
} from './admin-login-redirect'

const ADMIN_APP_ORIGIN = 'http://localhost:5173'

describe('resolveAdminAppRedirect', () => {
  it('오리진이 ADMIN_APP_ORIGIN과 같으면 그 주소를 돌려준다', () => {
    expect(resolveAdminAppRedirect('http://localhost:5173/auth/callback', ADMIN_APP_ORIGIN)).toBe(
      'http://localhost:5173/auth/callback',
    )
  })

  it('허용 오리진 설정 끝의 슬래시는 무시한다', () => {
    expect(resolveAdminAppRedirect('http://localhost:5173/auth/callback', 'http://localhost:5173/')).toBe(
      'http://localhost:5173/auth/callback',
    )
  })

  it('해시는 제거해서 돌려준다', () => {
    expect(resolveAdminAppRedirect('http://localhost:5173/auth/callback#token=x', ADMIN_APP_ORIGIN)).toBe(
      'http://localhost:5173/auth/callback',
    )
  })

  it('오리진이 다르면 null이다', () => {
    expect(resolveAdminAppRedirect('https://evil.example/auth/callback', ADMIN_APP_ORIGIN)).toBeNull()
  })

  it('포트나 프로토콜이 다르면 null이다', () => {
    expect(resolveAdminAppRedirect('http://localhost:3000/auth/callback', ADMIN_APP_ORIGIN)).toBeNull()
    expect(resolveAdminAppRedirect('https://localhost:5173/auth/callback', ADMIN_APP_ORIGIN)).toBeNull()
  })

  it('허용 오리진을 앞부분에 포함시킨 다른 도메인은 거부한다', () => {
    expect(resolveAdminAppRedirect('http://localhost:5173.evil.example/auth/callback', ADMIN_APP_ORIGIN)).toBeNull()
    expect(resolveAdminAppRedirect('http://localhost:5173@evil.example/auth/callback', ADMIN_APP_ORIGIN)).toBeNull()
  })

  it('redirect가 없거나 올바른 URL이 아니면 null이다', () => {
    expect(resolveAdminAppRedirect(null, ADMIN_APP_ORIGIN)).toBeNull()
    expect(resolveAdminAppRedirect(undefined, ADMIN_APP_ORIGIN)).toBeNull()
    expect(resolveAdminAppRedirect('', ADMIN_APP_ORIGIN)).toBeNull()
    expect(resolveAdminAppRedirect('/auth/callback', ADMIN_APP_ORIGIN)).toBeNull()
    expect(resolveAdminAppRedirect('javascript:alert(1)', ADMIN_APP_ORIGIN)).toBeNull()
  })

  it('허용 오리진이 설정되지 않았으면 null이다', () => {
    expect(resolveAdminAppRedirect('http://localhost:5173/auth/callback', undefined)).toBeNull()
    expect(resolveAdminAppRedirect('http://localhost:5173/auth/callback', '')).toBeNull()
  })
})

describe('buildTokenRedirectUrl', () => {
  it('토큰을 쿼리스트링이 아닌 해시로 붙인다', () => {
    const url = buildTokenRedirectUrl('http://localhost:5173/auth/callback', 'aaa.bbb.ccc')

    expect(url).toBe('http://localhost:5173/auth/callback#token=aaa.bbb.ccc')
    expect(new URL(url).search).toBe('')
  })
})

describe('sanitizeInternalPath', () => {
  it('내부 경로는 쿼리까지 그대로 돌려준다', () => {
    expect(sanitizeInternalPath('/admin-login?redirect=abc')).toBe('/admin-login?redirect=abc')
  })

  it('외부 주소나 // 로 시작하는 값은 "/"로 대체한다', () => {
    expect(sanitizeInternalPath('https://evil.example')).toBe('/')
    expect(sanitizeInternalPath('//evil.example')).toBe('/')
    expect(sanitizeInternalPath('/\\evil.example')).toBe('/')
  })

  it('값이 없으면 "/"이다', () => {
    expect(sanitizeInternalPath(undefined)).toBe('/')
    expect(sanitizeInternalPath(null)).toBe('/')
    expect(sanitizeInternalPath('')).toBe('/')
  })
})

describe('resolveLoginDestination', () => {
  it('redirectTo가 내부 경로면 그대로 쓴다', () => {
    expect(resolveLoginDestination('/admin-login?redirect=abc', undefined)).toBe('/admin-login?redirect=abc')
  })

  it('redirectTo가 없으면 callbackUrl(Auth.js가 실패 시 붙임)의 경로와 쿼리를 쓴다', () => {
    expect(
      resolveLoginDestination(undefined, 'http://localhost:3000/admin-login?redirect=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fcallback'),
    ).toBe('/admin-login?redirect=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fcallback')
  })

  it('callbackUrl이 다른 사이트 주소여도 경로만 취해 이 사이트 안에 머문다', () => {
    expect(resolveLoginDestination(undefined, 'https://evil.example/steal?x=1')).toBe('/steal?x=1')
  })

  it('redirectTo가 있으면 callbackUrl보다 우선한다', () => {
    expect(resolveLoginDestination('/a', 'http://localhost:3000/b')).toBe('/a')
  })

  it('둘 다 없거나 올바르지 않으면 "/"이다', () => {
    expect(resolveLoginDestination(undefined, undefined)).toBe('/')
    expect(resolveLoginDestination('//evil.example', undefined)).toBe('/')
    expect(resolveLoginDestination(undefined, 'not a url')).toBe('/')
    expect(resolveLoginDestination(undefined, 'javascript:alert(1)')).toBe('/')
  })
})
