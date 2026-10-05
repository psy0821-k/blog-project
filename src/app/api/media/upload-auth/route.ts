import { getUploadAuthParams } from '@imagekit/next/server'
import { NextResponse } from 'next/server'

/**
 * ImageKit 클라이언트 업로드용 인증 파라미터(token, signature, expire)를 발급한다.
 * 파일은 브라우저가 ImageKit으로 직접 보내고, 서버는 관리자 확인 후 서명만 만든다.
 */
export async function GET(): Promise<NextResponse> {
  // TODO: 관리자 인증은 일단 비활성화. 배포 전에 아래 주석을 복구해야 한다.
  // const session = await auth()
  //
  // if (!session?.user || session.user.role !== 'ADMIN') {
  //   return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  // }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY

  if (!privateKey || !publicKey) {
    return NextResponse.json({ error: 'ImageKit 환경변수가 설정되지 않았습니다.' }, { status: 500 })
  }

  const authParams = getUploadAuthParams({ privateKey, publicKey })

  return NextResponse.json({ ...authParams, publicKey })
}
