import { NextRequest, NextResponse } from 'next/server'
import { createPostListResponse } from '@/lib/post-list-response'
import type { Prisma } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/api-auth'
import {
  conflictResponse,
  forbiddenResponse,
  invalidJsonResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { getNextDevLogNumber } from '@/lib/post-number'
import { createDevLogSchema } from '@/lib/post-schema'
import { isUniqueConstraintError, prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/slug'
import { inferMediaType } from '@/lib/media'

const DEVLOG_LIST_SELECT = {
  id: true,
  devNumber: true,
  title: true,
  slug: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect

const DEVLOG_LIST_ORDER_BY = [
  { devNumber: { sort: 'desc', nulls: 'last' } },
  { createdAt: 'desc' },
] satisfies Prisma.PostOrderByWithRelationInput[]

export async function GET(request: NextRequest) {
  return createPostListResponse(request, 'DEV_LOG', DEVLOG_LIST_SELECT, DEVLOG_LIST_ORDER_BY)
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

  const parsed = createDevLogSchema.safeParse(body)

  if (!parsed.success) {
    return validationErrorResponse(parsed.error)
  }

  const { slug, title, content, metaTitle, metaDescription, published, mediaUrls } = parsed.data

  let devLog

  try {
    devLog = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          type: 'DEV_LOG',
          title,
          slug: slug ?? generateSlug(title),
          content,
          metaTitle,
          metaDescription,
          published,
          devNumber: published ? await getNextDevLogNumber(tx) : undefined,
        },
      })

      if (mediaUrls?.length) {
        await tx.media.createMany({
          data: mediaUrls.map((url) => ({
            postId: created.id,
            url,
            type: inferMediaType(url),
          })),
        })
      }

      return created
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflictResponse('이미 사용 중인 slug입니다.')
    }

    throw error
  }

  return NextResponse.json(devLog, { status: 201 })
}
