import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminGuard from '@/components/common/AdminGuard'
import DeletePostButton from '@/components/features/post-form/DeletePostButton'
import { getPublishedPostBySlug, incrementPostViewCount } from '@/lib/post-detail'
import { sanitizePostHtml } from '@/lib/sanitize-post-html'
import { optimizePostHtml } from '@/lib/optimize-post-html'
import { decodeSlugParam } from '@/lib/slug'
import ProjectSummary from '@/components/pages/cardListPage/ProjectSummary'

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

const getProject = cache(async (slug: string) => {
  const decodedSlug = decodeSlugParam(slug)

  return decodedSlug ? getPublishedPostBySlug('PROJECT', decodedSlug) : null
})

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {}
  }

  return {
    title: project.metaTitle ?? project.title,
    description: project.metaDescription ?? undefined,
  }
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  void incrementPostViewCount(project.id).catch(() => undefined)
  const contentHtml = optimizePostHtml(sanitizePostHtml(project.content))

  return (
    <article className="p-4">
      <header className="mb-8">
        <AdminGuard>
          <Link href={`/projects/${encodeURIComponent(project.slug)}/edit`}>수정</Link>
          <DeletePostButton type="projects" slug={project.slug} />
        </AdminGuard>
        <ProjectSummary
          title={project.title}
          status={project.status}
          createdAt={project.createdAt}
          updatedAt={project.updatedAt}
          viewCount={project.viewCount}
          category={project.category?.name ?? null}
          technologies={project.postTags.map(({ tag }) => tag.name)}
          description={project.metaDescription}
        />
      </header>

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  )
}

export default ProjectDetailPage
