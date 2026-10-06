import { prisma } from '@/lib/prisma'
import { parsePaginationParams, toPaginationMeta } from '@/lib/pagination'
import { Prisma, PostType } from '@/generated/prisma/client'

/**
 * 발행된(published) 게시글을 타입별로 페이지네이션 조회한다.
 * select는 타입별로 노출 필드가 다를 수 있어(예: DEV_LOG는 thumbnailUrl 미사용) 호출부에서 주입받는다.
 * `?category=<slug>`가 있으면 해당 서브메뉴의 글만 조회한다. 존재하지 않는 slug는 빈 목록이 된다.
 */
export async function getPublishedPostList<T extends Prisma.PostSelect>(
  type: PostType,
  searchParams: URLSearchParams,
  select: T,
) {
  const pagination = parsePaginationParams(searchParams)

  const categorySlug = searchParams.get('category')

  const where: Prisma.PostWhereInput = {
    type,
    published: true,
    ...(categorySlug && { category: { type, slug: categorySlug } }),
  }

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      select,
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.post.count({ where }),
  ])

  return {
    data: posts,
    meta: toPaginationMeta(pagination, totalCount),
  }
}
