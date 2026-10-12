import { describe, expect, it } from 'vitest'

import { formatKoreanDate } from './format-date'

describe('formatKoreanDate', () => {
  it('UTC 기준 전날 오후 3시 이후는 한국 시간으로 다음 날 날짜가 된다', () => {
    expect(formatKoreanDate(new Date('2026-10-11T15:00:00Z'))).toBe('2026. 10. 12.')
  })

  it('한국 시간 자정 직전은 같은 날짜로 유지한다', () => {
    expect(formatKoreanDate(new Date('2026-10-12T14:59:59Z'))).toBe('2026. 10. 12.')
  })

  it('연말 UTC 오후는 한국 시간으로 해가 바뀐다', () => {
    expect(formatKoreanDate(new Date('2026-12-31T16:00:00Z'))).toBe('2027. 1. 1.')
  })
})
