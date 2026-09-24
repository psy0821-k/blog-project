import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

// 이미지/동영상 업로드만 허용. 동영상은 업로드 전 사용자가 직접 mp4/webm으로 변환해서 올린다.
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']

// Vercel Blob 클라이언트 업로드 자체 상한이 45MB이므로 그 아래로 여유를 둔다.
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const MAX_VIDEO_SIZE_BYTES = 40 * 1024 * 1024

/** clientPayload는 클라이언트가 보낸 임의 문자열이라 파싱 실패 시 undefined로 취급한다(이미지 상한으로 보수적 처리). */
function parseContentTypeFromPayload(clientPayload: string | null): string | undefined {
  if (!clientPayload) return undefined

  try {
    return (JSON.parse(clientPayload) as { contentType?: string }).contentType
  } catch {
    return undefined
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
          throw new Error('Not authenticated')
        }

        const contentType = parseContentTypeFromPayload(clientPayload)
        const isVideo = contentType?.startsWith('video/') ?? false

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // 업로드 완료 로그만 남긴다. Media 레코드 생성은 게시글 저장(POST/PATCH) 시점에
        // 클라이언트가 받은 blob.url을 본문/미디어 목록에 포함해 함께 처리한다.
        console.log('blob upload completed', blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
