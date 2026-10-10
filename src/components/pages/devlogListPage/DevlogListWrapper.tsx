'use client'
import Link from 'next/link'
import { notFound, useSearchParams } from 'next/navigation'
import NoResult from '@/components/common/NoResult'
import Pagination from '@/components/pages/cardListPage/Pagination'
import { usePostList } from '@/hooks/use-post-list'

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}.${month}.${day}`
}

const CELL_CLASS = 'whitespace-nowrap px-2 py-2'
const HIDE_ON_MOBILE_CLASS = 'hidden sm:table-cell'

export const DevlogListWrapper = () => {
  const searchParams = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const { data, isLoading, isError, isPlaceholderData } = usePostList('devlog', { page })

  if (data && !isPlaceholderData && page > Math.max(1, data.meta.totalPages)) {
    notFound()
  }

  return (
    <section className="p-4 md:p-0">
      <h2 className="sr-only">개발 일지 목록</h2>
      {isLoading && <p>불러오는 중...</p>}
      {isError && <p>개발 일지를 불러오지 못했습니다.</p>}

      {data?.data.length ? (
        <table className="w-full">
          <thead className="sr-only sm:not-sr-only">
            <tr className="border-b text-sm text-gray-500">
              <th scope="col" className={`${CELL_CLASS} ${HIDE_ON_MOBILE_CLASS} text-center`}>
                번호
              </th>
              <th scope="col" className={`${CELL_CLASS} text-left`}>
                제목
              </th>
              <th scope="col" className={`${CELL_CLASS} text-right`}>
                작성일
              </th>
              <th scope="col" className={`${CELL_CLASS} ${HIDE_ON_MOBILE_CLASS} text-right`}>
                조회
              </th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((post, index) => {
              // 최신 글이 가장 큰 번호가 되도록 전체 글 수를 기준으로 계산한다.(api로 번호 지정해줄 예정 삭제)
              const postNumber = data.meta.totalCount - (page - 1) * data.meta.pageSize - index

              return (
                <tr key={post.id} className="border-b">
                  <td
                    className={`${CELL_CLASS} ${HIDE_ON_MOBILE_CLASS} text-center text-sm text-gray-500`}
                  >
                    {postNumber}
                  </td>
                  <td className="w-full max-w-0">
                    <Link href={`/devlog/${post.slug}`} className={`block truncate ${CELL_CLASS}`}>
                      {post.title}
                    </Link>
                  </td>
                  <td className={`${CELL_CLASS} text-right text-sm text-gray-500`}>
                    <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                  </td>
                  <td
                    className={`${CELL_CLASS} ${HIDE_ON_MOBILE_CLASS} text-right text-sm text-gray-500`}
                  >
                    {post.viewCount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        data?.meta.totalCount === 0 && <NoResult />
      )}

      {data && <Pagination page={page} totalPages={data.meta.totalPages} />}
    </section>
  )
}

export default DevlogListWrapper
