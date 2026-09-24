import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPostList } from '@/lib/post-list'
import type { Prisma } from '@/generated/prisma/client'

const PROJECT_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  thumbnailUrl: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect

export async function GET(request: NextRequest) {
  const result = await getPublishedPostList('PROJECT', request.nextUrl.searchParams, PROJECT_LIST_SELECT)
  return NextResponse.json(result)
}
