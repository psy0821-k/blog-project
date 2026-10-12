import { describe, expect, it } from 'vitest'

import { decodeSlugParam, generateSlug } from './slug'

describe('decodeSlugParam', () => {
  it('퍼센트 인코딩된 한글 slug를 디코딩한다', () => {
    expect(decodeSlugParam('%ED%95%9C%EA%B8%80-%EA%B8%80')).toBe('한글-글')
  })

  it('인코딩이 없는 slug는 그대로 반환한다', () => {
    expect(decodeSlugParam('my-post')).toBe('my-post')
  })

  it('잘못된 인코딩이면 예외 대신 null을 반환한다', () => {
    expect(decodeSlugParam('%E3')).toBeNull()
  })
})

describe('generateSlug', () => {
  it('영문 제목은 소문자 하이픈 형태에 8자리 접미사를 붙인다', () => {
    expect(generateSlug('Hello World')).toMatch(/^hello-world-[0-9a-f]{8}$/)
  })

  it('특수문자와 연속 공백·하이픈을 정리한다', () => {
    expect(generateSlug('  Hello,   World!!  -- Next.js  ')).toMatch(/^hello-world-nextjs-[0-9a-f]{8}$/)
  })

  it('영숫자가 하나도 남지 않는 제목(한글 등)은 접미사만 반환한다', () => {
    expect(generateSlug('한글 제목')).toMatch(/^[0-9a-f]{8}$/)
  })

  it('같은 제목도 매번 다른 slug를 만든다', () => {
    expect(generateSlug('same title')).not.toBe(generateSlug('same title'))
  })
})
