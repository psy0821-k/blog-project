import { notFound } from 'next/navigation'

import AdminGuard from '@/components/common/AdminGuard'
import PostForm from '@/components/features/post-form/PostForm'
import type { CreatePostType } from '@/hooks/use-create-post'
import { getPostForEdit } from '@/lib/post-detail'
import { POST_TYPE_BY_ROUTE } from '@/lib/post-type'
import { decodeSlugParam } from '@/lib/slug'

interface PostEditPageProps {
  type: CreatePostType
  slug: string
  heading: string
}

const PostEditPage = async ({ type, slug, heading }: PostEditPageProps) => {
  const decodedSlug = decodeSlugParam(slug)
  const post = decodedSlug ? await getPostForEdit(POST_TYPE_BY_ROUTE[type], decodedSlug) : null

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
            categoryId: post.categoryId,
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            published: post.published,
            ...(type !== 'devlog' && {
              thumbnailUrl: post.thumbnailUrl,
              status: post.status,
              tags: post.postTags.map(({ tag }) => tag.name),
            }),
          }}
        />
      </AdminGuard>
    </main>
  )
}

export default PostEditPage
