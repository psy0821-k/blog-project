// 브라우저/서버 어디서든 쓰이는 순수 함수 모음. 서버 전용 모듈을 가져오지 않는다.

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']
const YOUTUBE_SHORT_HOST = 'youtu.be'
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/
const YOUTUBE_EMBED_BASE_URL = 'https://www.youtube.com/embed/'

/** watch/shorts/embed 경로에서 영상 ID 후보를 꺼낸다. */
function extractVideoId(url: URL): string | null {
  if (url.hostname === YOUTUBE_SHORT_HOST) {
    return url.pathname.slice(1)
  }

  if (url.pathname === '/watch') {
    return url.searchParams.get('v')
  }

  const [, kind, id] = url.pathname.split('/')

  return kind === 'shorts' || kind === 'embed' ? (id ?? null) : null
}

/**
 * YouTube 영상 주소를 iframe 임베드 URL로 변환한다. YouTube 주소가 아니면 null.
 * 에디터에 임의의 URL이 iframe으로 들어가지 않도록 허용 도메인을 여기서 강제한다.
 */
export function toYouTubeEmbedUrl(input: string): string | null {
  let url: URL

  try {
    url = new URL(input.trim())
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null
  }

  if (url.hostname !== YOUTUBE_SHORT_HOST && !YOUTUBE_HOSTS.includes(url.hostname)) {
    return null
  }

  const videoId = extractVideoId(url)

  return videoId && YOUTUBE_ID_PATTERN.test(videoId) ? `${YOUTUBE_EMBED_BASE_URL}${videoId}` : null
}
