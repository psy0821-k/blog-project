import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { forbiddenResponse, invalidJsonResponse, validationErrorResponse } from '@/lib/api-response'
import { inferMediaType } from '@/lib/media'
import { getPublishedPostList } from '@/lib/post-list'
import { createProjectSchema } from '@/lib/post-schema'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/slug'
import type { Prisma } from '@/generated/prisma/client'

const PROJECT_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  thumbnailUrl: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect

export async function GET(request: NextRequest) {
  const result = await getPublishedPostList('PROJECT', request.nextUrl.searchParams, PROJECT_LIST_SELECT)
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

  const parsed = createProjectSchema.safeParse(body)

  if (!parsed.success) {
    return validationErrorResponse(parsed.error)
  }

  const { title, content, thumbnailUrl, metaTitle, metaDescription, published, mediaUrls } = parsed.data

  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        type: 'PROJECT',
        title,
        slug: generateSlug(title),
        content,
        thumbnailUrl,
        metaTitle,
        metaDescription,
        published,
        authorId: admin.userId,
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

  return NextResponse.json(project, { status: 201 })
}
