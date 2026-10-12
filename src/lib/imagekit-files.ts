const IMAGEKIT_HOST = 'ik.imagekit.io'
const IMAGEKIT_FILES_API_URL = 'https://api.imagekit.io/v1/files'
const REQUEST_TIMEOUT_MS = 5000

interface ImageKitAsset {
  fileId: string
  filePath: string
}

/**
 * ImageKit URL에서 파일 경로(예: /posts/photo_abc123.jpg)를 뽑는다.
 * 첫 경로 조각은 ImageKit ID이고, `tr:` 변환 조각은 파일 경로가 아니므로 제외한다.
 * ik.imagekit.io가 아닌 주소(커스텀 도메인 등)는 경로를 신뢰할 수 없어 null을 반환한다.
 */
export function extractImageKitFilePath(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (parsed.hostname !== IMAGEKIT_HOST) {
      return null
    }

    const segments = parsed.pathname
      .split('/')
      .filter(Boolean)
      .slice(1)
      .filter((segment) => !segment.startsWith('tr:'))
      .map(decodeURIComponent)

    return segments.length ? `/${segments.join('/')}` : null
  } catch {
    return null
  }
}

function authHeaders(privateKey: string) {
  return { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}` }
}

/** 파일명으로 검색한 뒤 경로가 정확히 일치하는 파일의 fileId를 찾는다. 없으면 null이다. */
async function findFileId(filePath: string, privateKey: string): Promise<string | null> {
  const name = filePath.split('/').pop() ?? ''

  // searchQuery 문법을 깨뜨릴 수 있는 따옴표가 있으면 안전하게 건너뛴다.
  if (!name || name.includes('"')) {
    return null
  }

  const query = new URLSearchParams({ searchQuery: `name="${name}"` })
  const response = await fetch(`${IMAGEKIT_FILES_API_URL}?${query}`, {
    headers: authHeaders(privateKey),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`ImageKit 파일 검색 실패 (${response.status})`)
  }

  const assets = (await response.json()) as ImageKitAsset[]

  return assets.find((asset) => asset.filePath === filePath)?.fileId ?? null
}

async function deleteFileByUrl(url: string, privateKey: string): Promise<void> {
  const filePath = extractImageKitFilePath(url)

  if (!filePath) {
    return
  }

  const fileId = await findFileId(filePath, privateKey)

  if (!fileId) {
    return
  }

  const response = await fetch(`${IMAGEKIT_FILES_API_URL}/${fileId}`, {
    method: 'DELETE',
    headers: authHeaders(privateKey),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok && response.status !== 404) {
    throw new Error(`ImageKit 파일 삭제 실패 (${response.status})`)
  }
}

/**
 * URL에 해당하는 ImageKit 파일을 삭제한다. 최선 노력(best effort)이라 실패해도 던지지 않고 로그만 남긴다.
 * 글은 이미 DB에서 지워진 뒤라, 파일 정리 실패가 사용자 요청을 실패시키면 안 된다.
 */
export async function deleteImageKitFilesByUrls(urls: string[]): Promise<void> {
  if (!urls.length) {
    return
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

  if (!privateKey) {
    console.error('ImageKit 환경변수가 없어 파일 삭제를 건너뜁니다.')
    return
  }

  const results = await Promise.allSettled(urls.map((url) => deleteFileByUrl(url, privateKey)))

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`ImageKit 파일 삭제에 실패했습니다: ${urls[index]}`, result.reason)
    }
  })
}
