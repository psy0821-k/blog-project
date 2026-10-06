'use client'
import { notFound, useSearchParams } from 'next/navigation'
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
  const { data, isLoading, isError, isPlaceholderData } = usePostList(type, { page })

  // 이전 페이지 데이터(placeholder)의 meta로는 범위를 판단할 수 없으므로 실제 응답이 온 뒤에만 검사한다.
  // 글이 하나도 없어도 1페이지는 유효하므로 totalPages가 0이어도 최소 1로 본다.
  if (data && !isPlaceholderData && page > Math.max(1, data.meta.totalPages)) {
    notFound()
  }

  return (
    <div>
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
                  thumbnailUrl={post.thumbnailUrl}
                  href={`/${type}/${post.slug}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          // 로딩/에러 중에는 보이지 않고, 글이 하나도 없을 때만 보인다.
          data?.meta.totalCount === 0 && <NoResult />
        )}

        {data && <Pagination page={page} totalPages={data.meta.totalPages} />}
      </section>
    </div>
  )
}

export default ListWrapper
