import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type CategoryPostType = 'PROJECT' | 'LAB' | 'DEV_LOG'

export interface Category {
  id: string
  type: CategoryPostType
  name: string
  slug: string
  order: number
}

interface ApiErrorBody {
  error?: { message?: string }
}

// 서버 에러 메시지(예: 중복 이름)를 그대로 사용자에게 보여줄 수 있도록 Error에 담는다.
async function requestCategory<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}))
    throw new Error(body.error?.message ?? `요청에 실패했습니다. (${res.status})`)
  }

  return res.status === 204 ? (undefined as T) : res.json()
}

const jsonRequest = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export function useCategories(type: CategoryPostType) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => requestCategory<Category[]>(`/api/categories?type=${type}`),
  })
}

export function useCategoryMutations(type: CategoryPostType) {
  const queryClient = useQueryClient()
  const invalidateCategories = () => queryClient.invalidateQueries({ queryKey: ['categories', type] })

  const create = useMutation({
    mutationFn: (name: string) => requestCategory<Category>('/api/categories', jsonRequest('POST', { type, name })),
    onSuccess: invalidateCategories,
  })

  const update = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      requestCategory<Category>(`/api/categories/${id}`, jsonRequest('PATCH', { name })),
    onSuccess: invalidateCategories,
  })

  const remove = useMutation({
    mutationFn: (id: string) => requestCategory<void>(`/api/categories/${id}`, { method: 'DELETE' }),
    onSuccess: async () => {
      await invalidateCategories()
      // 삭제된 카테고리의 글이 미분류로 바뀌므로 목록 캐시도 갱신한다.
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return { create, update, remove }
}
