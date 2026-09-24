import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPostList } from '@/lib/post-list'
import type { Prisma } from '@/generated/prisma/client'

const DEVLOG_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PostSelect

export async function GET(request: NextRequest) {
  const result = await getPublishedPostList('DEV_LOG', request.nextUrl.searchParams, DEVLOG_LIST_SELECT)
  return NextResponse.json(result)
}
