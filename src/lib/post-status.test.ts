import { describe, expect, it } from 'vitest'
import { formatStatusLines } from './post-status'

describe('formatStatusLines', () => {
  it('밑줄로 이어진 상태를 줄바꿈으로 나눈다', () => {
    expect(formatStatusLines('IN_PROGRESS')).toBe('IN\nPROGRESS')
  })

  it('UP_COMING도 두 줄로 나눈다', () => {
    expect(formatStatusLines('UP_COMING')).toBe('UP\nCOMING')
  })

  it('밑줄이 없는 상태는 그대로 둔다', () => {
    expect(formatStatusLines('COMPLETED')).toBe('COMPLETED')
  })
})
