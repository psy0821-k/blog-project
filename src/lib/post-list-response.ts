import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { forbiddenResponse } from '@/lib/api-response'
import { getPublishedPostList } from '@/lib/post-list'
import type { Prisma, PostType } from '@/generated/prisma/client'

/**
 * 목록 API 공통 GET 처리. `?draft=true`이면 관리자만 임시저장 글 목록을 받을 수 있다.
 */
export async function createPostListResponse<T extends Prisma.PostSelect>(
  request: NextRequest,
  type: PostType,
  select: T,
) {
  const searchParams = request.nextUrl.searchParams
  const isDraft = searchParams.get('draft') === 'true'

  if (isDraft && !(await requireAdmin(request))) {
    return forbiddenResponse()
  }

  const result = await getPublishedPostList(type, searchParams, select, !isDraft)
  return NextResponse.json(result)
}
