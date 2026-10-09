import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPostList } from '@/lib/post-list'
import type { Prisma } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/api-auth'
import { conflictResponse, forbiddenResponse, invalidJsonResponse, validationErrorResponse } from '@/lib/api-response'
import { createPostSchema } from '@/lib/post-schema'
import { validateCategoryForType } from '@/lib/category'
import { isUniqueConstraintError, prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/slug'
import { replacePostTags } from '@/lib/tag'
import { inferMediaType } from '@/lib/media'

const LAB_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  thumbnailUrl: true,
  status: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect

export async function GET(request: NextRequest) {
  const result = await getPublishedPostList('LAB', request.nextUrl.searchParams, LAB_LIST_SELECT)
  return NextResponse.json(result)
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

  const parsed = createPostSchema.safeParse(body)

  if (!parsed.success) {
    return validationErrorResponse(parsed.error)
  }

  const {
    slug,
    title,
    content,
    thumbnailUrl,
    metaTitle,
    metaDescription,
    published,
    mediaUrls,
    categoryId,
    status,
    tags,
  } = parsed.data

  const invalidCategory = await validateCategoryForType(categoryId, 'LAB')

  if (invalidCategory) {
    return invalidCategory
  }

  let lab

  try {
    lab = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          type: 'LAB',
          title,
          slug: slug ?? generateSlug(title),
          content,
          thumbnailUrl,
          metaTitle,
          metaDescription,
          published,
          categoryId,
          status,
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
      if (tags?.length) {
        await replacePostTags(tx, created.id, tags)
      }

      return created
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflictResponse('이미 사용 중인 slug입니다.')
    }

    throw error
  }

  return NextResponse.json(lab, { status: 201 })
}
