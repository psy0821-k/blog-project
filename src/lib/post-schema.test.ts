import { describe, expect, it } from 'vitest'

import { createProjectSchema, slugSchema } from './post-schema'

describe('slugSchema', () => {
  it.each(['my-first-post', 'post1', '첫-번째-글', 'Mixed-Case'])('%s는 허용한다', (value) => {
    expect(slugSchema.safeParse(value).success).toBe(true)
  })

  it('대문자는 소문자로 정규화한다', () => {
    expect(slugSchema.parse('Mixed-Case')).toBe('mixed-case')
  })

  it.each(['', '  ', 'has space', '-leading', 'trailing-', 'double--hyphen', 'a/b', 'a?b'])(
    '%j는 거부한다',
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(false)
    },
  )
})

describe('createProjectSchema slug', () => {
  const base = { title: '제목', content: '', published: true }

  it('slug를 생략해도 통과한다', () => {
    expect(createProjectSchema.safeParse(base).success).toBe(true)
  })

  it('형식이 맞지 않는 slug는 거부한다', () => {
    expect(createProjectSchema.safeParse({ ...base, slug: 'has space' }).success).toBe(false)
  })
})
