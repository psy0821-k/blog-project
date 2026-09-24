import { prisma } from '@/lib/prisma'
import { PostType } from '@/generated/prisma/client'

/**
 * 발행된(published) 게시글을 slug와 타입으로 단건 조회한다.
 * 조회수(viewCount) 증가는 이 함수의 책임이 아니다 — @updatedAt 오염 문제로 별도 처리 필요.
 * (자세한 내용: docs/devlog/2026-09-25-viewcount-updatedat-pollution.md)
 */
export async function getPublishedPostBySlug(type: PostType, slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      type,
      published: true,
    },
  })
}
