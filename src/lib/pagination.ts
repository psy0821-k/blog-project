import { z } from 'zod'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

export interface PaginationParams {
  page: number
  pageSize: number
  skip: number
  take: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// 잘못된 값(음수, 숫자가 아님 등)은 기본값으로 대체하고, pageSize는 과도한 조회를 막기 위해 MAX_PAGE_SIZE로 상한을 둔다.
const pageSchema = z.coerce.number().int().positive().catch(DEFAULT_PAGE)
const pageSizeSchema = z.coerce.number().int().positive().catch(DEFAULT_PAGE_SIZE)

/** URLSearchParams에서 page/pageSize를 파싱한다. */
export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = pageSchema.parse(searchParams.get('page') ?? undefined)
  const pageSize = Math.min(
    pageSizeSchema.parse(searchParams.get('pageSize') ?? undefined),
    MAX_PAGE_SIZE,
  )

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  }
}

export function toPaginationMeta(
  { page, pageSize }: PaginationParams,
  totalCount: number,
): PaginationMeta {
  return {
    page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  }
}
