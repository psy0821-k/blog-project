import type { z } from 'zod'
import type { postStatusSchema } from '@/lib/post-schema'

export type PostStatus = z.infer<typeof postStatusSchema>

// 진행 상태별 화면 표시 문구
export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
}
