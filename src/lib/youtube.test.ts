import { describe, expect, it } from 'vitest'

import { toYouTubeEmbedUrl } from './youtube'

const EMBED = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

describe('toYouTubeEmbedUrl', () => {
  it.each([
    ['watch 주소', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['모바일 주소', 'https://m.youtube.com/watch?v=dQw4w9WgXcQ'],
    ['youtu.be 단축 주소', 'https://youtu.be/dQw4w9WgXcQ'],
    ['shorts 주소', 'https://www.youtube.com/shorts/dQw4w9WgXcQ'],
    ['embed 주소', 'https://www.youtube.com/embed/dQw4w9WgXcQ'],
    ['앞뒤 공백', '  https://youtu.be/dQw4w9WgXcQ  '],
    ['추가 쿼리가 붙은 주소', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s'],
  ])('%s를 임베드 URL로 바꾼다', (_label, input) => {
    expect(toYouTubeEmbedUrl(input)).toBe(EMBED)
  })

  it.each([
    ['YouTube가 아닌 도메인', 'https://vimeo.com/watch?v=dQw4w9WgXcQ'],
    ['YouTube를 흉내 낸 도메인', 'https://www.youtube.com.evil.com/watch?v=dQw4w9WgXcQ'],
    ['영상 ID 형식이 아님', 'https://www.youtube.com/watch?v=short'],
    ['영상 ID 없음', 'https://www.youtube.com/watch'],
    ['지원하지 않는 경로', 'https://www.youtube.com/channel/dQw4w9WgXcQ'],
    ['http/https가 아닌 프로토콜', 'javascript:alert(1)'],
    ['URL 형식이 아님', 'not a url'],
    ['빈 문자열', ''],
  ])('%s는 null을 반환한다', (_label, input) => {
    expect(toYouTubeEmbedUrl(input)).toBeNull()
  })
})
