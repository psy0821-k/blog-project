import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { PostListType } from '@/hooks/use-post-list'
import type { CreatePostInput, createDevLogInput } from '@/lib/post-schema'

// 개발일지는 속한 프로젝트(projectId)를 함께 보낼 수 있다.
type CreatePostPayload = CreatePostInput & Pick<createDevLogInput, 'projectId'>

export type CreatePostType = PostListType

export interface CreatedPost {
  id: string
  slug: string
  title: string
  content: string
  category: string
  account: number
}

export interface ApiErrorBody {
  error?: { message?: string }
}

// 서버 에러 메시지(예: 검증 실패)를 그대로 사용자에게 보여줄 수 있도록 Error에 담는다.
export async function createPost(
  type: CreatePostType,
  input: CreatePostPayload,
): Promise<CreatedPost> {
  const res = await fetch(`/api/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}))
    throw new Error(body.error?.message ?? `게시글을 저장하지 못했습니다. (${res.status})`)
  }

  return res.json()
}

export function useCreatePost(type: CreatePostType) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreatePostPayload) => createPost(type, input),
    // 저장한 글이 목록에 바로 나타나도록 해당 종류의 목록 캐시를 갱신한다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts', type] }),
  })
}
