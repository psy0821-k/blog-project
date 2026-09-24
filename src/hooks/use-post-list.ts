import { useQuery } from '@tanstack/react-query'
import type { PaginationMeta } from '@/lib/pagination'

export type PostListType = 'projects' | 'lab' | 'devlog'

export interface PostListItem {
  id: string
  title: string
  slug: string
  thumbnailUrl?: string | null
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface PostListResponse {
  data: PostListItem[]
  meta: PaginationMeta
}

interface UsePostListParams {
  page?: number
  pageSize?: number
}

async function fetchPostList(type: PostListType, params: UsePostListParams): Promise<PostListResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))

  const res = await fetch(`/api/${type}?${searchParams.toString()}`)
  if (!res.ok) {
    throw new Error(`게시글 목록을 불러오지 못했습니다. (${res.status})`)
  }

  return res.json()
}

export function usePostList(type: PostListType, params: UsePostListParams = {}) {
  const { page = 1, pageSize } = params

  return useQuery({
    queryKey: ['posts', type, page, pageSize],
    queryFn: () => fetchPostList(type, { page, pageSize }),
  })
}
