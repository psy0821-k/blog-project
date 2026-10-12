'use client'
import { notFound, useSearchParams } from 'next/navigation'
import { useIsAdmin } from '@/hooks/use-admin-session'
import { usePostList } from '@/hooks/use-post-list'
import CardComponent from './CardComponent'
import NoResult from '@/components/common/NoResult'
import Pagination from './Pagination'

type ProjectType = 'projects' | 'lab'

interface ListWrapperProps {
  type: ProjectType
}

export const ListWrapper = ({ type }: ListWrapperProps) => {
  const searchParams = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const category = searchParams.get('category') ?? undefined
  const q = searchParams.get('q')?.trim() || undefined
  const isDraft = useIsAdmin() && searchParams.get('draft') === 'true'
  const { data, isLoading, isError, isPlaceholderData } = usePostList(type, {
    page,
    category,
    draft: isDraft,
    q,
  })

  if (data && !isPlaceholderData && page > Math.max(1, data.meta.totalPages)) {
    notFound()
  }

  return (
    <section>
      <h2 className="sr-only">{type === 'projects' ? '프로젝트' : '실험실'} 목록</h2>
      {isLoading && <p>불러오는 중...</p>}
      {isError && (
        <p>{type === 'projects' ? '프로젝트' : '실험실'} 컨텐츠를 불러오지 못했습니다.</p>
      )}

      {data?.data.length ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 p-4">
          {data.data.map((post) => (
            <li key={post.id}>
              <CardComponent
                title={post.title}
                thumbnailUrl={post.thumbnailUrl ?? null}
                status={post.status}
                createdAt={post.createdAt}
                viewCount={post.viewCount}
                href={
                  isDraft
                    ? `/${type}/${encodeURIComponent(post.slug)}/edit`
                    : `/${type}/${post.slug}`
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        data?.meta.totalCount === 0 && <NoResult keyword={q} />
      )}

      {data && (
        <Pagination
          page={page}
          totalPages={data.meta.totalPages}
          category={category}
          draft={isDraft}
          q={q}
        />
      )}
    </section>
  )
}

export default ListWrapper
