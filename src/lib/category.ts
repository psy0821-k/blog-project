import { badRequestResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import type { PostType } from '@/generated/prisma/client'

/**
 * 글에 지정하려는 categoryId가 해당 글 종류(PostType)의 카테고리인지 확인한다.
 * 지정하지 않았거나(undefined) 미분류(null)로 되돌리는 경우는 검증할 것이 없어 통과시킨다.
 * 유효하지 않으면 400 응답을, 문제없으면 null을 반환하므로 호출부에서 응답이 있으면 그대로 반환한다.
 */
export async function validateCategoryForType(categoryId: string | null | undefined, type: PostType) {
  if (!categoryId) {
    return null
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } })

  if (!category || category.type !== type) {
    return badRequestResponse('유효하지 않은 서브메뉴입니다.')
  }

  return null
}
