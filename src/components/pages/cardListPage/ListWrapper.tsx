'use client'
import { usePostList } from '@/hooks/use-post-list'
import CardComponent from './CardComponent'
import NoResult from '@/components/common/NoResult'

type ProjectType = 'projects' | 'lab'

interface ListWrapperProps {
  type: ProjectType
}

export const ListWrapper = ({ type }: ListWrapperProps) => {
  const { data, isLoading, isError } = usePostList(type)

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
          <NoResult />
        )}
      </section>
    </div>
  )
}

export default ListWrapper
