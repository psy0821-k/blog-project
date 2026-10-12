'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

import { createUploadTracker, type UploadTracker } from '@/lib/uploaded-files'

const UploadTrackerContext = createContext<UploadTracker | null>(null)

/** 폼 하나가 이번 세션에 업로드한 파일을 기록하는 범위를 만든다. */
export function UploadTrackerProvider({ children }: { children: ReactNode }) {
  const [tracker] = useState(createUploadTracker)

  return <UploadTrackerContext.Provider value={tracker}>{children}</UploadTrackerContext.Provider>
}

/** 추적 범위 밖(폼이 아닌 곳)에서 업로드하면 기록하지 않으므로 null을 허용한다. */
export function useOptionalUploadTracker(): UploadTracker | null {
  return useContext(UploadTrackerContext)
}

export function useUploadTracker(): UploadTracker {
  const tracker = useOptionalUploadTracker()

  if (!tracker) {
    throw new Error('UploadTrackerProvider 안에서만 사용할 수 있습니다.')
  }

  return tracker
}
