import { describe, expect, it } from 'vitest'

import { buildResizedImageUrl } from './imagekit-url'

describe('buildResizedImageUrl', () => {
  it('ImageKit 이미지에 너비 변환 파라미터(tr=w-N)를 붙인다', () => {
    expect(buildResizedImageUrl('https://ik.imagekit.io/myid/posts/a.png', 800)).toBe(
      'https://ik.imagekit.io/myid/posts/a.png?tr=w-800',
    )
  })

  it('이미 변환 파라미터가 있으면 그대로 둔다', () => {
    const src = 'https://ik.imagekit.io/myid/posts/a.png?tr=w-100'

    expect(buildResizedImageUrl(src, 800)).toBe(src)
  })

  it('ImageKit이 아닌 도메인은 그대로 둔다', () => {
    const src = 'https://example.com/a.png'

    expect(buildResizedImageUrl(src, 800)).toBe(src)
  })

  it('https가 아닌 주소는 그대로 둔다', () => {
    const src = 'http://ik.imagekit.io/myid/a.png'

    expect(buildResizedImageUrl(src, 800)).toBe(src)
  })

  it('URL 형식이 아니면 그대로 반환한다', () => {
    expect(buildResizedImageUrl('/relative/a.png', 800)).toBe('/relative/a.png')
  })
})
