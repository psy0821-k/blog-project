import type { z } from 'zod'
import type { postStatusSchema } from '@/lib/post-schema'

export type PostStatus = z.infer<typeof postStatusSchema>

// 진행 상태별 화면 표시 문구
export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
}

// 원형 배지처럼 좁은 영역에서는 단어 단위(IN_PROGRESS → IN / PROGRESS)로 줄바꿈한다.
export const formatStatusLines = (status: PostStatus): string => status.replaceAll('_', '\n')
