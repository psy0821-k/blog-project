import { describe, expect, it } from 'vitest'

import { optimizePostHtml } from './optimize-post-html'

const IMAGE = 'https://ik.imagekit.io/myid/posts/a.png'

describe('optimizePostHtml', () => {
  it('ImageKit 이미지에 srcset과 sizes를 붙이고 src를 1200 너비로 바꾼다', () => {
    const html = optimizePostHtml(`<img src="${IMAGE}" class="img-md">`)

    expect(html).toContain(`src="${IMAGE}?tr=w-1200"`)
    expect(html).toContain(`${IMAGE}?tr=w-480 480w`)
    expect(html).toContain(`${IMAGE}?tr=w-1920 1920w`)
    expect(html).toContain('sizes="(min-width: 1440px) 600px, (min-width: 768px) 538px, 100vw"')
  })

  it('크기 프리셋 클래스에 맞는 sizes를 쓴다', () => {
    const html = optimizePostHtml(`<img src="${IMAGE}" class="img-sm">`)

    expect(html).toContain('sizes="(min-width: 1440px) 360px, (min-width: 768px) 308px, 60vw"')
  })

  it('프리셋 클래스가 없으면 기본(img-md) sizes를 쓴다', () => {
    const html = optimizePostHtml(`<img src="${IMAGE}">`)

    expect(html).toContain('sizes="(min-width: 1440px) 600px, (min-width: 768px) 538px, 100vw"')
  })

  it('ImageKit 이미지가 아니면 속성을 건드리지 않는다', () => {
    const html = optimizePostHtml('<img src="https://example.com/a.png">')

    expect(html).not.toContain('srcset')
    expect(html).toContain('src="https://example.com/a.png"')
  })

  it('이미지가 아닌 요소는 그대로 둔다', () => {
    expect(optimizePostHtml('<p class="ql-align-center">글</p>')).toBe(
      '<p class="ql-align-center">글</p>',
    )
  })
})
