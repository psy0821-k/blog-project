import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/api-auth'
import { forbiddenResponse, invalidJsonResponse, validationErrorResponse } from '@/lib/api-response'
import { inferMediaType } from '@/lib/media'
import { getPublishedPostList } from '@/lib/post-list'
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

const createProjectSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean(),
  // 본문에 삽입된 이미지/동영상 URL 목록. 업로드(/api/media/upload)로 받은 blob URL을 그대로 전달한다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export async function GET(request: NextRequest) {
  const result = await getPublishedPostList('PROJECT', request.nextUrl.searchParams, PROJECT_LIST_SELECT)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession()

  if (!session) {
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
        authorId: session.user.id,
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
