import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { forbiddenResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

/**
 * 개발일지에 연결할 프로젝트 선택지를 반환한다. 관리자 전용이다.
 * 목록 API와 달리 상한 없이 전체를 내려주고, 임시저장 프로젝트도 포함한다.
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)

  if (!admin) {
    return forbiddenResponse()
  }

  const projects = await prisma.post.findMany({
    where: { type: 'PROJECT' },
    select: { id: true, title: true, published: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects)
}
