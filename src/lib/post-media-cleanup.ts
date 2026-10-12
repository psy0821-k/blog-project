import { deleteImageKitFilesByUrls } from '@/lib/imagekit-files'
import { prisma } from '@/lib/prisma'

/**
 * 글에 딸린 미디어 URL(썸네일 + 본문 미디어)을 모은다. 글을 지우기 전에 호출해야 한다.
 */
export async function collectPostMediaUrls(post: {
  id: string
  thumbnailUrl: string | null
}): Promise<string[]> {
  const media = await prisma.media.findMany({
    where: { postId: post.id },
    select: { url: true },
  })

  const urls = media.map((item) => item.url)

  if (post.thumbnailUrl) {
    urls.push(post.thumbnailUrl)
  }

  return [...new Set(urls)]
}

/**
 * 글을 지운 뒤, 다른 글이 아직 쓰고 있지 않은 파일만 ImageKit에서 삭제한다.
 * 같은 URL을 다른 글이 참조하고 있으면 그 글의 이미지가 깨지므로 남겨 둔다.
 */
export async function deleteUnreferencedMediaFiles(urls: string[]): Promise<void> {
  if (!urls.length) {
    return
  }

  const [referencedByMedia, referencedByThumbnail] = await Promise.all([
    prisma.media.findMany({ where: { url: { in: urls } }, select: { url: true } }),
    prisma.post.findMany({ where: { thumbnailUrl: { in: urls } }, select: { thumbnailUrl: true } }),
  ])

  const referenced = new Set([
    ...referencedByMedia.map((item) => item.url),
    ...referencedByThumbnail.map((item) => item.thumbnailUrl),
  ])

  await deleteImageKitFilesByUrls(urls.filter((url) => !referenced.has(url)))
}
