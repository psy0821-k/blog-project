import type { UploadedMedia } from '@/hooks/use-media-upload'

/** 폼이 이번 세션에 업로드한 파일을 기록한다. 저장하지 않고 폼을 벗어나면 이 목록으로 정리한다. */
export interface UploadTracker {
  track: (media: UploadedMedia) => void
  untrack: (fileId: string) => void
  /** 기록된 파일을 모두 꺼내고 목록을 비운다. */
  drain: () => UploadedMedia[]
}

export function createUploadTracker(): UploadTracker {
  const files = new Map<string, UploadedMedia>()

  return {
    track: (media) => {
      files.set(media.fileId, media)
    },
    untrack: (fileId) => {
      files.delete(fileId)
    },
    drain: () => {
      const drained = [...files.values()]
      files.clear()
      return drained
    },
  }
}

function getFileName(url: string): string {
  return url.split('?')[0].split('/').pop() ?? ''
}

/**
 * 저장하려는 글(본문·썸네일)에서 쓰이지 않는 업로드 파일을 골라낸다.
 * 정상 이미지를 지우는 것보다 남기는 쪽이 안전하므로, URL이 그대로 없어도 파일명이 본문에 있으면 사용 중으로 본다.
 */
export function findUnusedFiles(
  files: UploadedMedia[],
  used: { content: string; thumbnailUrl: string | null },
): UploadedMedia[] {
  return files.filter(({ url }) => {
    const fileName = getFileName(url)
    const isInContent = used.content.includes(url) || (fileName !== '' && used.content.includes(fileName))

    return !isInContent && url !== used.thumbnailUrl
  })
}

/**
 * 업로드 파일을 ImageKit에서 삭제한다. 페이지를 떠나는 중에도 요청이 끝나도록 keepalive를 쓰며,
 * 실패해도 사용자 흐름을 막지 않도록 결과는 기다리지 않는다.
 */
export function deleteUploadedFiles(files: UploadedMedia[]): void {
  files.forEach(({ fileId }) => {
    void fetch(`/api/media/${fileId}`, { method: 'DELETE', keepalive: true }).catch(() => undefined)
  })
}
