import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiErrorBody, CreatePostType } from '@/hooks/use-create-post'
import type { UpdateDevLogInput, UpdatePostInput } from '@/lib/post-schema'

// 개발일지는 속한 프로젝트(projectId)를 함께 보낼 수 있다. null은 연결 해제다.
type UpdatePostPayload = UpdatePostInput & Pick<UpdateDevLogInput, 'projectId'>

export interface UpdatedPost {
  id: string
  slug: string
  title: string
}

export async function updatePost(
  type: CreatePostType,
  slug: string,
  input: UpdatePostPayload,
): Promise<UpdatedPost> {
  const res = await fetch(`/api/${type}/${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}))
    throw new Error(body.error?.message ?? `게시글을 수정하지 못했습니다. (${res.status})`)
  }

  return res.json()
}

export function useUpdatePost(type: CreatePostType, slug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdatePostPayload) => updatePost(type, slug, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts', type] }),
  })
}
