import { describe, expect, it } from 'vitest'

import { sanitizePostHtml } from './sanitize-post-html'

describe('sanitizePostHtml', () => {
  describe('위험한 요소 제거', () => {
    it('script 태그와 내용을 제거한다', () => {
      expect(sanitizePostHtml('<p>안녕</p><script>alert(1)</script>')).toBe('<p>안녕</p>')
    })

    it('이벤트 핸들러 속성을 제거한다', () => {
      const html = sanitizePostHtml('<img src="https://ik.imagekit.io/a.png" onerror="alert(1)">')

      expect(html).not.toContain('onerror')
    })

    it('style 속성을 제거한다', () => {
      expect(sanitizePostHtml('<p style="color:red">글</p>')).toBe('<p>글</p>')
    })

    it('javascript: 링크는 href를 제거한다', () => {
      expect(sanitizePostHtml('<a href="javascript:alert(1)">링크</a>')).not.toContain('javascript:')
    })

    it('http 이미지는 허용하지 않는다(https만)', () => {
      expect(sanitizePostHtml('<img src="http://example.com/a.png">')).not.toContain('http://')
    })
  })

  describe('링크', () => {
    it('https 링크는 유지하고 rel="noopener noreferrer"를 붙인다', () => {
      const html = sanitizePostHtml('<a href="https://example.com" target="_blank">링크</a>')

      expect(html).toContain('href="https://example.com"')
      expect(html).toContain('rel="noopener noreferrer"')
    })

    it('mailto 링크는 허용한다', () => {
      expect(sanitizePostHtml('<a href="mailto:a@b.com">메일</a>')).toContain('href="mailto:a@b.com"')
    })
  })

  describe('iframe', () => {
    it('YouTube 임베드는 허용한다', () => {
      const html = sanitizePostHtml(
        '<iframe class="ql-video" src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
      )

      expect(html).toContain('src="https://www.youtube.com/embed/dQw4w9WgXcQ"')
    })

    it('다른 도메인의 iframe은 제거한다', () => {
      const html = sanitizePostHtml('<iframe src="https://evil.example.com/x"></iframe>')

      expect(html).not.toContain('evil.example.com')
    })
  })

  describe('에디터가 붙이는 요소', () => {
    it('이미지 크기 프리셋 클래스는 유지한다', () => {
      const html = sanitizePostHtml('<img class="img-lg" src="https://ik.imagekit.io/a.png" alt="설명">')

      expect(html).toContain('class="img-lg"')
      expect(html).toContain('alt="설명"')
    })

    it('허용 목록에 없는 임의 클래스는 제거한다', () => {
      const html = sanitizePostHtml('<img class="img-lg evil" src="https://ik.imagekit.io/a.png">')

      expect(html).toContain('class="img-lg"')
      expect(html).not.toContain('evil')
    })

    it('Quill 정렬 클래스와 제목 태그를 유지한다', () => {
      expect(sanitizePostHtml('<h2 class="ql-align-center">제목</h2>')).toBe(
        '<h2 class="ql-align-center">제목</h2>',
      )
    })

    it('굵게·기울임·밑줄 안의 글씨 크기 클래스를 유지한다', () => {
      expect(sanitizePostHtml('<strong class="ql-size-huge">제목</strong>')).toBe(
        '<strong class="ql-size-huge">제목</strong>',
      )
      expect(sanitizePostHtml('<em class="ql-size-large evil">글</em>')).toBe(
        '<em class="ql-size-large">글</em>',
      )
    })

    it('영상 태그는 https 주소만 허용한다', () => {
      const html = sanitizePostHtml(
        '<video src="https://ik.imagekit.io/a.mp4" controls></video><video src="http://x.com/b.mp4"></video>',
      )

      expect(html).toContain('src="https://ik.imagekit.io/a.mp4"')
      expect(html).not.toContain('http://x.com')
    })
  })
})
