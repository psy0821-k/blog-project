import AdminGuard from '@/components/common/AdminGuard'
import PostStatusBadge from '@/components/common/PostStatusBadge'
import TagList from '@/components/common/TagList'
import DeletePostButton from '@/components/features/post-form/DeletePostButton'
import { optimizePostHtml } from '@/lib/optimize-post-html'
import { getPublishedPostBySlug, incrementPostViewCount } from '@/lib/post-detail'
import { sanitizePostHtml } from '@/lib/sanitize-post-html'
import { decodeSlugParam } from '@/lib/slug'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

interface LabDetailProps {
  params: Promise<{ slug: string }>
}

// 한글 slug는 params에 인코딩된 채로 들어오므로 디코딩한 값으로 조회한다.
const getLabs = cache(async (slug: string) => {
  const decodedSlug = decodeSlugParam(slug)

  return decodedSlug ? getPublishedPostBySlug('LAB', decodedSlug) : null
})

export async function generateMetadata({ params }: LabDetailProps): Promise<Metadata> {
  const { slug } = await params
  const lab = await getLabs(slug)

  if (!lab) {
    return {}
  }

  return {
    title: lab.metaTitle ?? lab.title,
    description: lab.metaDescription ?? undefined,
  }
}

const LabDetailPage = async ({ params }: LabDetailProps) => {
  const { slug } = await params
  const lab = await getLabs(slug)

  if (!lab) {
    return notFound()
  }

  void incrementPostViewCount(lab.id).catch(() => undefined)
  const contentHtml = optimizePostHtml(sanitizePostHtml(lab.content))

  return (
    <article className="p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{lab.title}</h1>
        <PostStatusBadge status={lab.status} />
        <TagList tags={lab.postTags.map(({ tag }) => tag.name)} />
        <AdminGuard>
          <DeletePostButton type="lab" slug={lab.slug} />
        </AdminGuard>
        <p className="mt-2 text-sm text-gray-500">
          <time dateTime={lab.createdAt.toISOString()}>
            {lab.createdAt.toLocaleDateString('ko-KR')}
          </time>
          <span aria-hidden="true"> · </span>
          조회 {lab.viewCount}
        </p>
      </header>

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  )
}

export default LabDetailPage
