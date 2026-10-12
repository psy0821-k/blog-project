import { useQuery } from '@tanstack/react-query'

import type { ApiErrorBody } from '@/hooks/use-create-post'

export interface ProjectOption {
  id: string
  title: string
  published: boolean
}

async function fetchProjectOptions(): Promise<ProjectOption[]> {
  const res = await fetch('/api/admin/project-options')

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}))
    throw new Error(body.error?.message ?? `프로젝트 목록을 불러오지 못했습니다. (${res.status})`)
  }

  return res.json()
}

// 개발일지 폼의 프로젝트 선택지. 관리자만 호출할 수 있다.
export function useProjectOptions() {
  return useQuery({
    queryKey: ['project-options'],
    queryFn: fetchProjectOptions,
  })
}
