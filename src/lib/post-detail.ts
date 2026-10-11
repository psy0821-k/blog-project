import { requireAdminSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { PostType } from '@/generated/prisma/client'

/**
 * 발행된(published) 게시글을 slug와 타입으로 단건 조회한다.
 */
export async function getPublishedPostBySlug(type: PostType, slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      type,
      published: true,
    },
    include: { postTags: { include: { tag: true } }, category: true },
  })
}

export async function getPostForEdit(type: PostType, slug: string) {
  if (!(await requireAdminSession())) {
    return null
  }

  return prisma.post.findFirst({
    where: { slug, type },
    include: { postTags: { include: { tag: true } } },
  })
}

export async function incrementPostViewCount(id: string): Promise<void> {
  await prisma.$executeRaw`UPDATE "Post" SET "viewCount" = "viewCount" + 1 WHERE id = ${id}`
}
