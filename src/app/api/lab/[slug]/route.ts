import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/api-auth'
import { forbiddenResponse, invalidJsonResponse, notFoundResponse, validationErrorResponse } from '@/lib/api-response'
import { inferMediaType } from '@/lib/media'
import { getPublishedPostBySlug } from '@/lib/post-detail'
import { prisma } from '@/lib/prisma'

const updateLabSchema = z.object({
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean().optional(),
  // 본문 media 목록 전체 교체. 생략하면 기존 Media를 건드리지 않는다.
  mediaUrls: z.array(z.string().url()).optional(),
})

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  const lab = await getPublishedPostBySlug('LAB', slug)

  if (!lab) {
    return notFoundResponse()
  }

  return NextResponse.json(lab)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession()

  if (!session) {
    return forbiddenResponse()
  }

  const { slug } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return invalidJsonResponse()
  }

  const parsed = updateLabSchema.safeParse(body)

  if (!parsed.success) {
    return validationErrorResponse(parsed.error)
  }

  const existing = await prisma.post.findUnique({ where: { slug } })

  if (!existing || existing.type !== 'LAB') {
    return notFoundResponse()
  }

  const { mediaUrls, ...postData } = parsed.data

  const lab = await prisma.$transaction(async (tx) => {
    const updated = await tx.post.update({
      where: { id: existing.id },
      data: postData,
    })

    if (mediaUrls !== undefined) {
      await tx.media.deleteMany({ where: { postId: existing.id } })

      if (mediaUrls.length) {
        await tx.media.createMany({
          data: mediaUrls.map((url) => ({
            postId: existing.id,
            url,
            type: inferMediaType(url),
          })),
        })
      }
    }

    return updated
  })

  return NextResponse.json(lab)
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAdminSession()

  if (!session) {
    return forbiddenResponse()
  }

  const { slug } = await params

  const existing = await prisma.post.findUnique({ where: { slug } })

  if (!existing || existing.type !== 'LAB') {
    return notFoundResponse()
  }

  await prisma.post.delete({ where: { id: existing.id } })

  return new NextResponse(null, { status: 204 })
}
