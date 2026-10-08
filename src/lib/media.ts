import { MediaType } from '@/generated/prisma/client'
import { isVideoUrl } from '@/lib/media-validation'

/**
 * 미디어 URL의 확장자로 MediaType 확인
 * 업로드 허용 타입 : image/*, video/mp4, video/webm
 */
export function inferMediaType(url: string): MediaType {
  return isVideoUrl(url) ? MediaType.VIDEO : MediaType.IMAGE
}
