import { NextRequest, NextResponse } from 'next/server'
import { notFoundResponse } from '@/lib/api-response'

const IMAGEKIT_FILES_API_URL = 'https://api.imagekit.io/v1/files'
const FILE_ID_PATTERN = /^[A-Za-z0-9]+$/

interface RouteParams {
  params: Promise<{ fileId: string }>
}

/**
 * ImageKit에 업로드된 파일을 삭제한다. 업로드 취소(미리보기에서 제거) 시 호출한다.
 * 비공개 키가 필요해 브라우저에서 직접 지울 수 없으므로 서버를 거친다.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  // TODO: 관리자 인증은 일단 비활성화. 배포 전에 requireAdmin 확인을 추가해야 한다.
  const { fileId } = await params

  if (!FILE_ID_PATTERN.test(fileId)) {
    return notFoundResponse()
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

  if (!privateKey) {
    return NextResponse.json({ error: { message: 'ImageKit 환경변수가 설정되지 않았습니다.' } }, { status: 500 })
  }

  const response = await fetch(`${IMAGEKIT_FILES_API_URL}/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}` },
  })

  if (response.status === 404) {
    return notFoundResponse()
  }

  if (!response.ok) {
    return NextResponse.json({ error: { message: '파일 삭제에 실패했습니다.' } }, { status: 502 })
  }

  return new NextResponse(null, { status: 204 })
}
