import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminGuard from '@/components/common/AdminGuard'
import PostStatusBadge from '@/components/common/PostStatusBadge'
import DeletePostButton from '@/components/features/post-form/DeletePostButton'
import { getPublishedPostBySlug, incrementPostViewCount } from '@/lib/post-detail'
import { sanitizePostHtml } from '@/lib/sanitize-post-html'
import { optimizePostHtml } from '@/lib/optimize-post-html'
import { decodeSlugParam } from '@/lib/slug'

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

// generateMetadata와 페이지가 같은 글을 쓰므로, 한 요청 안에서 DB 조회를 1번만 하도록 캐시한다.
// 한글 slug는 params에 인코딩된 채로 들어오므로 디코딩한 값으로 조회한다.
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

  // 조회수는 렌더링과 무관하므로 기다리지 않는다. 실패해도 페이지는 보여준다.
  void incrementPostViewCount(project.id).catch(() => undefined)

  // 저장된 HTML은 렌더링 직전에 1회 sanitize한 뒤 이미지 srcset을 붙인다.
  const contentHtml = optimizePostHtml(sanitizePostHtml(project.content))

  return (
    <article className="p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <PostStatusBadge status={project.status} />        <AdminGuard>
          <Link href={`/projects/${encodeURIComponent(project.slug)}/edit`}>수정</Link>
          <DeletePostButton type="projects" slug={project.slug} />
        </AdminGuard>
        <p className="mt-2 text-sm text-gray-500">
          <time dateTime={project.createdAt.toISOString()}>
            {project.createdAt.toLocaleDateString('ko-KR')}
          </time>
          <span aria-hidden="true">| </span>
          조회 {project.viewCount}
        </p>
      </header>

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  )
}

export default ProjectDetailPage
