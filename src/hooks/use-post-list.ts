import { keepPreviousData, useQuery } from '@tanstack/react-query'
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
  // 서브메뉴(카테고리) slug. 없으면 전체 조회
  category?: string
}

async function fetchPostList(type: PostListType, params: UsePostListParams): Promise<PostListResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.category) searchParams.set('category', params.category)

  const res = await fetch(`/api/${type}?${searchParams.toString()}`)
  if (!res.ok) {
    throw new Error(`게시글 목록을 불러오지 못했습니다. (${res.status})`)
  }

  return res.json()
}

export function usePostList(type: PostListType, params: UsePostListParams = {}) {
  const { page = 1, pageSize, category } = params

  return useQuery({
    queryKey: ['posts', type, page, pageSize, category],
    queryFn: () => fetchPostList(type, { page, pageSize, category }),
    // 페이지 전환 중에도 이전 페이지 목록을 유지해 깜빡임을 막는다.
    placeholderData: keepPreviousData,
  })
}
