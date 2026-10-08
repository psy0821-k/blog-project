import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiErrorBody, CreatePostType } from '@/hooks/use-create-post'

export async function deletePost(type: CreatePostType, slug: string): Promise<void> {
  const res = await fetch(`/api/${type}/${encodeURIComponent(slug)}`, { method: 'DELETE' })

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}))
    throw new Error(body.error?.message ?? `게시글을 삭제하지 못했습니다. (${res.status})`)
  }
}

export function useDeletePost(type: CreatePostType, slug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePost(type, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts', type] }),
  })
}
