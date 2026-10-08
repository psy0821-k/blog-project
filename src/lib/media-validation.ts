// 브라우저에서도 import되는 파일이라 Prisma 등 서버 전용 모듈을 가져오면 안 된다.

// 이미지/동영상 업로드만 허용. 동영상은 업로드 전 사용자가 직접 mp4/webm으로 변환해서 올린다.
export const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
]

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_SIZE_BYTES = 40 * 1024 * 1024
export const MAX_THUMBNAIL_VIDEO_SIZE_BYTES = 10 * 1024 * 1024

const VIDEO_EXTENSIONS = ['.mp4', '.webm']

export type MediaPurpose = 'body' | 'thumbnail'

export function isVideoUrl(url: string): boolean {
  const pathname = url.split('?')[0].toLowerCase()

  return VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext))
}

export const VIDEO_OPTIMIZATION_HINT =
  '업로드 전에 영상 최적화를 해보세요, 해상도 720p~1080p로 압축하면 용량과 로딩이 크게 줄어듭니다.'

export function validateMediaFile(file: File, purpose: MediaPurpose = 'body'): string | null {
  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return '지원하지 않는 파일 형식입니다. (이미지: jpeg/png/webp, 동영상: mp4/webm)'
  }

  const isVideo = file.type.startsWith('video/')
  const maxVideoSize =
    purpose === 'thumbnail' ? MAX_THUMBNAIL_VIDEO_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES
  const maxSize = isVideo ? maxVideoSize : MAX_IMAGE_SIZE_BYTES

  if (file.size > maxSize) {
    const message = `파일 크기는 ${maxSize / 1024 / 1024}MB 이하여야 합니다.`

    return isVideo ? `${message} ${VIDEO_OPTIMIZATION_HINT}` : message
  }

  return null
}
