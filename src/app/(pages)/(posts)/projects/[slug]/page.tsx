import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminGuard from '@/components/common/AdminGuard'
import DeletePostButton from '@/components/features/post-form/DeletePostButton'
import { formatKoreanDate } from '@/lib/format-date'
import {
  getPublishedPostBySlug,
  getPublishedProjectDevLogs,
  incrementPostViewCount,
} from '@/lib/post-detail'
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
  const devLogs = await getPublishedProjectDevLogs(project.id)
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
          thumbnailUrl={project.thumbnailUrl}
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

      {devLogs.length > 0 && (
        <section aria-labelledby="project-devlogs-heading" className="mt-12">
          <h2 id="project-devlogs-heading">개발일지</h2>
          <ul className="mt-4 divide-y border-y">
            {devLogs.map((devLog) => (
              <li key={devLog.slug}>
                <Link
                  href={`/devlog/${encodeURIComponent(devLog.slug)}`}
                  className="flex items-center gap-4 px-2 py-3 hover:bg-gray-100"
                >
                  <span className="w-8 shrink-0 text-center text-sm text-gray-500">
                    {devLog.devNumber ?? '-'}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{devLog.title}</span>
                  <time
                    dateTime={devLog.createdAt.toISOString()}
                    className="shrink-0 text-sm text-gray-500"
                  >
                    {formatKoreanDate(devLog.createdAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

export default ProjectDetailPage
