import { getUploadAuthParams } from '@imagekit/next/server'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { forbiddenResponse } from '@/lib/api-response'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin(request)

  if (!admin) {
    return forbiddenResponse()
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY

  if (!privateKey || !publicKey) {
    return NextResponse.json({ error: 'ImageKit 환경변수가 설정되지 않았습니다.' }, { status: 500 })
  }

  const authParams = getUploadAuthParams({ privateKey, publicKey })

  return NextResponse.json({ ...authParams, publicKey })
}
