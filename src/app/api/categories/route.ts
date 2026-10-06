import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import {
  conflictResponse,
  forbiddenResponse,
  invalidJsonResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { createCategorySchema, postTypeSchema } from '@/lib/post-schema'
import { isUniqueConstraintError, prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/slug'

/** 서브메뉴 목록 조회. `?type=PROJECT`로 게시글 종류별 필터링한다. */
export async function GET(request: NextRequest) {
  const type = postTypeSchema.safeParse(request.nextUrl.searchParams.get('type'))

  const categories = await prisma.category.findMany({
    where: type.success ? { type: type.data } : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })

  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)

  if (!admin) {
    return forbiddenResponse()
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return invalidJsonResponse()
  }

  const parsed = createCategorySchema.safeParse(body)

  if (!parsed.success) {
    return validationErrorResponse(parsed.error)
  }

  const { type, name, order } = parsed.data

  try {
    const category = await prisma.category.create({
      data: { type, name, slug: generateSlug(name), order },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflictResponse('이미 존재하는 서브메뉴입니다.')
    }

    throw error
  }
}
