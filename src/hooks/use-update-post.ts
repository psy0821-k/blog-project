import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiErrorBody, CreatePostType } from '@/hooks/use-create-post'
import type { UpdatePostInput } from '@/lib/post-schema'

export interface UpdatedPost {
  id: string
  slug: string
  title: string
}

export async function updatePost(
  type: CreatePostType,
  slug: string,
  input: UpdatePostInput,
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
    mutationFn: (input: UpdatePostInput) => updatePost(type, slug, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts', type] }),
  })
}
