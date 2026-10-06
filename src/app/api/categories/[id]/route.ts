import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import {
  conflictResponse,
  forbiddenResponse,
  invalidJsonResponse,
  notFoundResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { updateCategorySchema } from '@/lib/post-schema'
import { isRecordNotFoundError, isUniqueConstraintError, prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin(request)

  if (!admin) {
    return forbiddenResponse()
  }

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return invalidJsonResponse()
  }

  const parsed = updateCategorySchema.safeParse(body)

  if (!parsed.success) {
    return validationErrorResponse(parsed.error)
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(category)
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return notFoundResponse()
    }

    if (isUniqueConstraintError(error)) {
      return conflictResponse('이미 존재하는 서브메뉴입니다.')
    }

    throw error
  }
}

/** 삭제해도 소속 글은 지워지지 않고 categoryId만 null(미분류)로 돌아간다. */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin(request)

  if (!admin) {
    return forbiddenResponse()
  }

  const { id } = await params

  try {
    await prisma.category.delete({ where: { id } })
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return notFoundResponse()
    }

    throw error
  }

  return new NextResponse(null, { status: 204 })
}
