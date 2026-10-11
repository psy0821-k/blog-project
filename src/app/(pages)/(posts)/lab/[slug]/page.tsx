import AdminGuard from '@/components/common/AdminGuard'
import DeletePostButton from '@/components/features/post-form/DeletePostButton'
import ProjectSummary from '@/components/pages/cardListPage/ProjectSummary'
import { optimizePostHtml } from '@/lib/optimize-post-html'
import { getPublishedPostBySlug, incrementPostViewCount } from '@/lib/post-detail'
import { sanitizePostHtml } from '@/lib/sanitize-post-html'
import { decodeSlugParam } from '@/lib/slug'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

interface LabDetailProps {
  params: Promise<{ slug: string }>
}

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
        <AdminGuard>
          <Link href={`/lab/${encodeURIComponent(lab.slug)}/edit`}>수정</Link>
          <DeletePostButton type="lab" slug={lab.slug} />
        </AdminGuard>
      </header>
      <ProjectSummary
        title={lab.title}
        status={lab.status}
        createdAt={lab.createdAt}
        updatedAt={lab.updatedAt}
        viewCount={lab.viewCount}
        category={lab.category?.name ?? null}
        technologies={lab.postTags.map(({ tag }) => tag.name)}
        description={lab.metaDescription}
      />
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  )
}

export default LabDetailPage
