import { afterEach, describe, expect, it, vi } from 'vitest'

import { updatePost } from './use-update-post'

const INPUT = { title: '새 제목', thumbnailUrl: null }

const mockFetch = (response: Partial<Response> & { json?: () => Promise<unknown> }) => {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('updatePost', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('종류와 slug에 맞는 경로로 JSON을 PATCH하고 수정된 글을 반환한다', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ id: 'a1', slug: 'my-post' }) })

    const result = await updatePost('projects', 'my-post', INPUT)

    expect(fetchMock).toHaveBeenCalledWith('/api/projects/my-post', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(INPUT),
    })
    expect(result).toEqual({ id: 'a1', slug: 'my-post' })
  })

  it('lab 종류는 /api/lab/[slug]로 요청한다', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ id: 'b1', slug: 'x' }) })

    await updatePost('lab', 'x', INPUT)

    expect(fetchMock.mock.calls[0][0]).toBe('/api/lab/x')
  })

  it('한글 slug는 인코딩해서 요청한다', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({}) })

    await updatePost('projects', '첫-글', INPUT)

    expect(fetchMock.mock.calls[0][0]).toBe(`/api/projects/${encodeURIComponent('첫-글')}`)
  })

  it('실패하면 서버 에러 메시지를 담아 던진다', async () => {
    mockFetch({ ok: false, status: 400, json: async () => ({ error: { message: '검증 실패' } }) })

    await expect(updatePost('projects', 'my-post', INPUT)).rejects.toThrow('검증 실패')
  })

  it('에러 본문이 없으면 상태 코드를 담은 기본 메시지를 던진다', async () => {
    mockFetch({ ok: false, status: 404, json: async () => Promise.reject(new Error('no body')) })

    await expect(updatePost('projects', 'my-post', INPUT)).rejects.toThrow('(404)')
  })
})
