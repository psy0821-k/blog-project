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

/**
 * 개발일지가 속한 프로젝트의 링크 정보를 조회한다. 발행된 프로젝트만 반환한다.
 */
export async function getPublishedProjectLink(projectId: string | null) {
  if (!projectId) {
    return null
  }

  return prisma.post.findFirst({
    where: { id: projectId, type: 'PROJECT', published: true },
    select: { slug: true, title: true },
  })
}

/**
 * 프로젝트에 연결된 발행된 개발일지를 번호 내림차순으로 조회한다.
 */
export async function getPublishedProjectDevLogs(projectId: string) {
  return prisma.post.findMany({
    where: { projectId, type: 'DEV_LOG', published: true },
    select: { slug: true, title: true, devNumber: true, createdAt: true },
    orderBy: [{ devNumber: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
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
