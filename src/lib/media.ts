import { MediaType } from '@/generated/prisma/client'

const VIDEO_EXTENSIONS = ['.mp4', '.webm']

/**
 * blob URL의 확장자로 MediaType을 추론한다.
 * 업로드 허용 타입(image/*, video/mp4, video/webm)과 짝을 맞춘 목록이라 그 외 확장자는 없다고 가정한다.
 */
export function inferMediaType(url: string): MediaType {
  const pathname = url.split('?')[0].toLowerCase()
  const isVideo = VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext))

  return isVideo ? MediaType.VIDEO : MediaType.IMAGE
}
