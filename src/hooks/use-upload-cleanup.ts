import { useCallback, useEffect } from 'react'

import { useUploadTracker } from '@/hooks/use-upload-tracker'
import { deleteUploadedFiles, findUnusedFiles } from '@/lib/uploaded-files'

interface SavedContent {
  content: string
  thumbnailUrl: string | null
}

/**
 * 폼에서 업로드했지만 저장되지 않은 파일을 ImageKit에서 정리한다.
 * - 폼을 벗어나면(취소, 뒤로가기 등 화면 전환으로 언마운트) 기록된 파일을 모두 삭제한다.
 * - 탭 닫기·새로고침은 pagehide에서 삭제한다. bfcache에 들어가는 경우(persisted)는 되돌아올 수 있어 건너뛴다.
 * - 저장에 성공하면 finalizeSave로 본문·썸네일에서 쓰지 않는 파일만 삭제하고 기록을 비운다.
 */
export function useUploadCleanup() {
  const tracker = useUploadTracker()

  useEffect(() => {
    const cleanup = () => deleteUploadedFiles(tracker.drain())

    const handlePageHide = (event: PageTransitionEvent) => {
      if (!event.persisted) cleanup()
    }

    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      cleanup()
    }
  }, [tracker])

  const finalizeSave = useCallback(
    (saved: SavedContent) => {
      deleteUploadedFiles(findUnusedFiles(tracker.drain(), saved))
    },
    [tracker],
  )

  return { finalizeSave }
}
