import { afterEach, describe, expect, it, vi } from 'vitest'

import { createUploadTracker, deleteUploadedFiles, findUnusedFiles } from './uploaded-files'

const file = (name: string) => ({
  url: `https://ik.imagekit.io/myid/posts/${name}`,
  fileId: `id-${name}`,
})

describe('createUploadTracker', () => {
  it('기록한 파일을 drain으로 모두 꺼내고 목록을 비운다', () => {
    const tracker = createUploadTracker()
    tracker.track(file('a.png'))
    tracker.track(file('b.png'))

    expect(tracker.drain()).toEqual([file('a.png'), file('b.png')])
    expect(tracker.drain()).toEqual([])
  })

  it('untrack한 파일은 drain에 나오지 않는다', () => {
    const tracker = createUploadTracker()
    tracker.track(file('a.png'))
    tracker.track(file('b.png'))
    tracker.untrack('id-a.png')

    expect(tracker.drain()).toEqual([file('b.png')])
  })

  it('같은 fileId를 다시 기록해도 하나만 남는다', () => {
    const tracker = createUploadTracker()
    tracker.track(file('a.png'))
    tracker.track(file('a.png'))

    expect(tracker.drain()).toHaveLength(1)
  })
})

describe('findUnusedFiles', () => {
  const files = [file('used.png'), file('removed.png'), file('thumb.png')]

  it('본문에도 썸네일에도 없는 파일만 반환한다', () => {
    const used = {
      content: `<p><img src="${file('used.png').url}"></p>`,
      thumbnailUrl: file('thumb.png').url,
    }

    expect(findUnusedFiles(files, used)).toEqual([file('removed.png')])
  })

  it('URL 형태가 달라도 파일명이 본문에 있으면 사용 중으로 본다', () => {
    const used = { content: '<img src="/other/prefix/used.png">', thumbnailUrl: null }

    expect(findUnusedFiles([file('used.png')], used)).toEqual([])
  })

  it('본문이 비어 있고 썸네일도 없으면 모두 반환한다', () => {
    expect(findUnusedFiles(files, { content: '', thumbnailUrl: null })).toEqual(files)
  })

  it('추적한 파일이 없으면 빈 배열을 반환한다', () => {
    expect(findUnusedFiles([], { content: '<p>x</p>', thumbnailUrl: null })).toEqual([])
  })
})

describe('deleteUploadedFiles', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('파일마다 keepalive DELETE 요청을 보낸다', () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    deleteUploadedFiles([file('a.png'), file('b.png')])

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('/api/media/id-a.png', { method: 'DELETE', keepalive: true })
    expect(fetchMock).toHaveBeenCalledWith('/api/media/id-b.png', { method: 'DELETE', keepalive: true })
  })

  it('파일이 없으면 요청을 보내지 않는다', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    deleteUploadedFiles([])

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('요청이 실패해도 예외를 던지지 않는다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))

    expect(() => deleteUploadedFiles([file('a.png')])).not.toThrow()
    await Promise.resolve()
  })
})
