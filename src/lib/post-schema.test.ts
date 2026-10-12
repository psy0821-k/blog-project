import { describe, expect, it } from 'vitest'

import { createDevLogSchema, createPostSchema, slugSchema, updateDevLogSchema } from './post-schema'

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

describe('createPostSchema slug', () => {
  const base = { title: '제목', content: '', published: true }

  it('slug를 생략해도 통과한다', () => {
    expect(createPostSchema.safeParse(base).success).toBe(true)
  })

  it('형식이 맞지 않는 slug는 거부한다', () => {
    expect(createPostSchema.safeParse({ ...base, slug: 'has space' }).success).toBe(false)
  })
})

describe('devlog projectId', () => {
  const base = { title: '제목', content: '', published: true }
  const projectId = '3f8f1d7a-2b6c-4a3e-9d0e-5c1b7a9e4f20'

  it('작성 시 projectId를 생략해도 통과한다', () => {
    expect(createDevLogSchema.safeParse(base).success).toBe(true)
  })

  it('작성 시 uuid 형식의 projectId를 받는다', () => {
    expect(createDevLogSchema.parse({ ...base, projectId }).projectId).toBe(projectId)
  })

  it('작성 시 uuid가 아닌 projectId는 거부한다', () => {
    expect(createDevLogSchema.safeParse({ ...base, projectId: 'not-uuid' }).success).toBe(false)
  })

  it('수정 시 null로 프로젝트 연결을 해제할 수 있다', () => {
    expect(updateDevLogSchema.parse({ projectId: null }).projectId).toBeNull()
  })

  it('projects/lab 작성 스키마는 projectId를 받지 않고 버린다', () => {
    expect(createPostSchema.parse({ ...base, projectId })).not.toHaveProperty('projectId')
  })
})
