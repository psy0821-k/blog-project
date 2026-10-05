// 브라우저/서버 어디서든 쓰는 순수 함수 모음. 서버 전용 모듈을 가져오지 않는다.

const IMAGEKIT_HOSTNAME = 'ik.imagekit.io'
const TRANSFORMATION_PARAM = 'tr'

export function buildResizedImageUrl(src: string, width: number): string {
  let url: URL

  try {
    url = new URL(src)
  } catch {
    return src
  }

  if (url.protocol !== 'https:' || url.hostname !== IMAGEKIT_HOSTNAME) {
    return src
  }

  if (url.searchParams.has(TRANSFORMATION_PARAM)) {
    return src
  }

  url.searchParams.set(TRANSFORMATION_PARAM, `w-${width}`)

  return url.toString()
}
