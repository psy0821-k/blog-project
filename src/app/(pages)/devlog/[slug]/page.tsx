import AdminGuard from '@/components/common/AdminGuard'
import DeletePostButton from '@/components/features/post-form/DeletePostButton'
import { optimizePostHtml } from '@/lib/optimize-post-html'
import { getPublishedPostBySlug, incrementPostViewCount } from '@/lib/post-detail'
import { sanitizePostHtml } from '@/lib/sanitize-post-html'
import { decodeSlugParam } from '@/lib/slug'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

interface DevLogDetailPageProps {
  params: Promise<{ slug: string }>
}

const getDevLog = cache(async (slug: string) => {
  const decodedSlug = decodeSlugParam(slug)

  return decodedSlug ? getPublishedPostBySlug('DEV_LOG', decodedSlug) : null
})

export async function generateMetadata({ params }: DevLogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const devLog = await getDevLog(slug)

  if (!devLog) {
    return {}
  }

  return {
    title: devLog.metaTitle ?? devLog.title,
    description: devLog.metaDescription ?? undefined,
  }
}

const DevLogDetailPage = async ({ params }: DevLogDetailPageProps) => {
  const { slug } = await params
  const devLog = await getDevLog(slug)

  if (!devLog) {
    notFound()
  }

  // 조회수는 렌더링과 무관하므로 기다리지 않는다. 실패해도 페이지는 보여준다.
  void incrementPostViewCount(devLog.id).catch(() => undefined)

  // 저장된 HTML은 렌더링 직전에 1회 sanitize한 뒤 이미지 srcset을 붙인다.
  const contentHtml = optimizePostHtml(sanitizePostHtml(devLog.content))

  return (
    <main className="content">
      <article className="p-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{devLog.title}</h1>
          <AdminGuard>
            <DeletePostButton type="devlog" slug={devLog.slug} />
          </AdminGuard>
          <p className="mt-2 text-sm text-gray-500">
            <time dateTime={devLog.createdAt.toISOString()}>
              {devLog.createdAt.toLocaleDateString('ko-KR')}
            </time>
            <span aria-hidden="true"> · </span>
            조회 {devLog.viewCount}
          </p>
        </header>

        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </main>
  )
}

export default DevLogDetailPage
