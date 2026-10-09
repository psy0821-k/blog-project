import { notFound } from 'next/navigation'

import AdminGuard from '@/components/common/AdminGuard'
import PostForm from '@/components/features/post-form/PostForm'
import type { CreatePostType } from '@/hooks/use-create-post'
import { getPublishedPostBySlug } from '@/lib/post-detail'
import { POST_TYPE_BY_ROUTE } from '@/lib/post-type'
import { decodeSlugParam } from '@/lib/slug'

interface PostEditPageProps {
  type: CreatePostType
  slug: string
  heading: string
}

// Projects/Lab 수정 페이지가 함께 쓰는 서버 컴포넌트. 기존 글을 불러와 PostForm을 수정 모드로 연다.
// 발행된 글만 조회하므로 임시저장 글은 수정 화면에서 열 수 없다.
const PostEditPage = async ({ type, slug, heading }: PostEditPageProps) => {
  const decodedSlug = decodeSlugParam(slug)
  const post = decodedSlug
    ? await getPublishedPostBySlug(POST_TYPE_BY_ROUTE[type], decodedSlug)
    : null

  if (!post) {
    notFound()
  }

  return (
    <main className="content">
      <AdminGuard type="page">
        <PostForm
          type={type}
          heading={heading}
          post={{
            slug: post.slug,
            title: post.title,
            content: post.content,
            thumbnailUrl: post.thumbnailUrl,
            categoryId: post.categoryId,
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            published: post.published,
            status: post.status,
            tags: post.postTags.map(({ tag }) => tag.name),
          }}
        />
      </AdminGuard>
    </main>
  )
}

export default PostEditPage
