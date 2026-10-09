import type { Prisma } from '@/generated/prisma/client'

interface TagInput {
  name: string
  slug: string
}

// 글자(한글 포함)·숫자와 기술명에 쓰이는 + # . 만 남기고 나머지는 하이픈으로 바꾼다. (예: "Next.js" → "next.js")
export function toTagSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#.]+/gu, '-')
    .replace(/^-|-$/g, '')
}

// slug 기준으로 중복을 제거하고, 먼저 입력한 표기를 이름으로 쓴다.
export function normalizeTags(names: string[]): TagInput[] {
  const tagsBySlug = new Map<string, TagInput>()

  for (const rawName of names) {
    const name = rawName.trim()
    const slug = toTagSlug(name)

    if (slug && !tagsBySlug.has(slug)) {
      tagsBySlug.set(slug, { name, slug })
    }
  }

  return [...tagsBySlug.values()]
}

/**
 * 글의 태그를 주어진 이름 목록으로 통째로 교체한다. 없는 태그는 새로 만든다.
 * 호출하는 쪽의 트랜잭션 안에서 실행해야 한다.
 */
export async function replacePostTags(
  tx: Prisma.TransactionClient,
  postId: string,
  names: string[],
): Promise<void> {
  const tags = normalizeTags(names)

  await tx.postTag.deleteMany({ where: { postId } })

  for (const { name, slug } of tags) {
    const tag = await tx.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    })

    await tx.postTag.create({ data: { postId, tagId: tag.id } })
  }
}
