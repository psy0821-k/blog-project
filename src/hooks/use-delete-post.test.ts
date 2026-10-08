import { afterEach, describe, expect, it, vi } from 'vitest'

import { deletePost } from './use-delete-post'

const mockFetch = (response: Partial<Response> & { json?: () => Promise<unknown> }) => {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('deletePost', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('종류와 slug에 맞는 경로로 DELETE 요청을 보낸다', async () => {
    const fetchMock = mockFetch({ ok: true, status: 204 })

    await deletePost('projects', 'my-post')

    expect(fetchMock).toHaveBeenCalledWith('/api/projects/my-post', { method: 'DELETE' })
  })

  it('lab 종류는 /api/lab/[slug]로 요청한다', async () => {
    const fetchMock = mockFetch({ ok: true, status: 204 })

    await deletePost('lab', 'x')

    expect(fetchMock.mock.calls[0][0]).toBe('/api/lab/x')
  })

  it('한글 slug는 인코딩해서 요청한다', async () => {
    const fetchMock = mockFetch({ ok: true, status: 204 })

    await deletePost('projects', '첫-글')

    expect(fetchMock.mock.calls[0][0]).toBe(`/api/projects/${encodeURIComponent('첫-글')}`)
  })

  it('실패하면 서버 에러 메시지를 담아 던진다', async () => {
    mockFetch({ ok: false, status: 403, json: async () => ({ error: { message: '권한 없음' } }) })

    await expect(deletePost('projects', 'my-post')).rejects.toThrow('권한 없음')
  })

  it('에러 본문이 없으면 상태 코드를 담은 기본 메시지를 던진다', async () => {
    mockFetch({ ok: false, status: 404, json: async () => Promise.reject(new Error('no body')) })

    await expect(deletePost('projects', 'my-post')).rejects.toThrow('(404)')
  })
})
