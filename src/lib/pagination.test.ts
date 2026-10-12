import { describe, expect, it } from 'vitest'

import { parsePaginationParams, toPaginationMeta } from './pagination'

const parse = (query: string) => parsePaginationParams(new URLSearchParams(query))

describe('parsePaginationParams', () => {
  it('값이 없으면 기본값(1페이지, 30개)을 쓴다', () => {
    expect(parse('')).toEqual({ page: 1, pageSize: 30, skip: 0, take: 30 })
  })

  it('page와 pageSize로 skip/take를 계산한다', () => {
    expect(parse('page=3&pageSize=10')).toEqual({ page: 3, pageSize: 10, skip: 20, take: 10 })
  })

  it('pageSize는 상한(50)으로 제한한다', () => {
    expect(parse('pageSize=1000').pageSize).toBe(50)
  })

  it.each(['0', '-1', 'abc', '1.5', ''])('page=%j는 기본값 1로 대체한다', (value) => {
    expect(parse(`page=${value}`).page).toBe(1)
  })

  it.each(['0', '-5', 'abc'])('pageSize=%j는 기본값 30으로 대체한다', (value) => {
    expect(parse(`pageSize=${value}`).pageSize).toBe(30)
  })
})

describe('toPaginationMeta', () => {
  const params = { page: 2, pageSize: 10, skip: 10, take: 10 }

  it('전체 개수로 총 페이지 수를 올림 계산한다', () => {
    expect(toPaginationMeta(params, 25)).toEqual({
      page: 2,
      pageSize: 10,
      totalCount: 25,
      totalPages: 3,
    })
  })

  it('글이 없으면 총 페이지 수는 0이다', () => {
    expect(toPaginationMeta(params, 0).totalPages).toBe(0)
  })

  it('개수가 pageSize의 배수면 딱 나누어 떨어진다', () => {
    expect(toPaginationMeta(params, 30).totalPages).toBe(3)
  })
})
