// 브라우저에서도 import되는 파일이라 Prisma 등 서버 전용 모듈을 가져오면 안 된다.

// 이미지/동영상 업로드만 허용. 동영상은 업로드 전 사용자가 직접 mp4/webm으로 변환해서 올린다.
export const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
]

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_SIZE_BYTES = 40 * 1024 * 1024

/**
 * 업로드 전 파일의 형식과 크기를 검사한다. 통과하면 null, 실패하면 사용자에게 보여줄 메시지를 반환한다.
 * ImageKit 클라이언트 업로드는 서버가 파일을 거치지 않아 이 검사가 1차 방어선이다.
 */
export function validateMediaFile(file: File): string | null {
  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return '지원하지 않는 파일 형식입니다. (이미지: jpeg/png/webp/gif, 동영상: mp4/webm)'
  }

  const isVideo = file.type.startsWith('video/')
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES

  if (file.size > maxSize) {
    return `파일 크기는 ${maxSize / 1024 / 1024}MB 이하여야 합니다.`
  }

  return null
}
