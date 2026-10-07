import { afterEach, describe, expect, it, vi } from 'vitest'

import { createPost } from './use-create-post'

const INPUT = { title: '제목', content: '<p>본문</p>', published: true }

const mockFetch = (response: Partial<Response> & { json?: () => Promise<unknown> }) => {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('createPost', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('종류에 맞는 경로로 JSON을 POST하고 생성된 글을 반환한다', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ id: 'a1', slug: 'je-mok' }) })

    const result = await createPost('projects', INPUT)

    expect(fetchMock).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(INPUT),
    })
    expect(result).toEqual({ id: 'a1', slug: 'je-mok' })
  })

  it('lab 종류는 /api/lab으로 요청한다', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ id: 'b1', slug: 'lab' }) })

    await createPost('lab', INPUT)

    expect(fetchMock.mock.calls[0][0]).toBe('/api/lab')
  })

  it('실패하면 서버 에러 메시지를 담아 던진다', async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Validation failed' } }),
    })

    await expect(createPost('projects', INPUT)).rejects.toThrow('Validation failed')
  })

  it('에러 본문이 없으면 상태 코드가 담긴 기본 메시지를 던진다', async () => {
    mockFetch({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json')
      },
    })

    await expect(createPost('projects', INPUT)).rejects.toThrow('(500)')
  })
})
