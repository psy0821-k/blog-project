import Link from 'next/link'

const PAGES_PER_GROUP = 5

interface PaginationProps {
  page: number
  totalPages: number
}

interface PageRange {
  start: number
  end: number
}

// 현재 페이지가 속한 5개 묶음(1~5, 6~10, 11~15 ...)의 번호 범위를 구한다.
export const getPageRange = (page: number, totalPages: number): PageRange => {
  const start = Math.floor((page - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1

  return { start, end: Math.min(totalPages, start + PAGES_PER_GROUP - 1) }
}

export const Pagination = ({ page, totalPages }: PaginationProps) => {
  if (totalPages <= 1) return null

  const { start, end } = getPageRange(page, totalPages)
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, index) => start + index)

  // 번호 창 밖의 처음/마지막 페이지는 따로 보여 주고, 사이에 숨은 페이지가 있을 때만 줄임표를 넣는다.
  const showFirstPage = start > 1
  const showFirstEllipsis = start > 2
  const showLastPage = end < totalPages
  const showLastEllipsis = end < totalPages - 1

  const renderLink = (pageNumber: number) => (
    <Link
      key={pageNumber}
      href={`?page=${pageNumber}`}
      aria-current={pageNumber === page ? 'page' : undefined}
      className={pageNumber === page ? 'font-bold underline' : undefined}
    >
      {pageNumber}
    </Link>
  )

  // 처음/마지막 페이지에서는 이동할 곳이 없으므로 링크 대신 비활성 텍스트로 보여 준다.
  const renderStep = (label: string, targetPage: number, disabled: boolean) =>
    disabled ? (
      <span aria-disabled="true" className="opacity-40">
        {label}
      </span>
    ) : (
      <Link href={`?page=${targetPage}`}>{label}</Link>
    )

  return (
    <nav aria-label="페이지 이동" className="flex justify-center gap-2 p-4">
      {renderStep('이전', page - 1, page <= 1)}
      {showFirstPage && renderLink(1)}
      {showFirstEllipsis && <span aria-hidden>…</span>}
      {pageNumbers.map(renderLink)}
      {showLastEllipsis && <span aria-hidden>…</span>}
      {showLastPage && renderLink(totalPages)}
      {renderStep('다음', page + 1, page >= totalPages)}
    </nav>
  )
}

export default Pagination
