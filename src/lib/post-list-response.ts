import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { forbiddenResponse } from '@/lib/api-response'
import { getPostList } from '@/lib/post-list'
import type { Prisma, PostType } from '@/generated/prisma/client'

/**
 * 목록 API 공통 GET 처리. `?draft=true`이면 관리자만 임시저장 글 목록을 받을 수 있다.
 * `orderBy`를 생략하면 최신 작성순으로 정렬한다.
 */
export async function createPostListResponse<T extends Prisma.PostSelect>(
  request: NextRequest,
  type: PostType,
  select: T,
  orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[],
) {
  const searchParams = request.nextUrl.searchParams
  const isDraft = searchParams.get('draft') === 'true'

  if (isDraft && !(await requireAdmin(request))) {
    return forbiddenResponse()
  }

  const result = await getPostList(type, searchParams, select, !isDraft, orderBy)
  return NextResponse.json(result)
}
