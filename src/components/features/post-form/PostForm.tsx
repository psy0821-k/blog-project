'use client'

import { useState, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'

import ThumbnailField from '@/components/features/post-form/ThumbnailField'
import RichTextEditor from '@/components/features/rich-text-editor/RichTextEditor'
import { useCategories, type CategoryPostType } from '@/hooks/use-categories'
import { useCreatePost, type CreatePostType } from '@/hooks/use-create-post'
import type { UploadedMedia } from '@/hooks/use-media-upload'
import { createPostSchema, slugSchema } from '@/lib/post-schema'

interface PostFormProps {
  type: CreatePostType
  heading: string
}

// 작성 경로(type)와 서브메뉴(Category)의 글 종류 매핑
const POST_TYPE_BY_ROUTE: Record<CreatePostType, CategoryPostType> = {
  projects: 'PROJECT',
  lab: 'LAB',
}

const INPUT_CLASS = 'w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
const LABEL_CLASS = 'text-sm font-semibold'
const ERROR_CLASS = 'text-xs text-red-600'

const PostForm = ({ type, heading }: PostFormProps) => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [thumbnail, setThumbnail] = useState<UploadedMedia | null>(null)
  const [categoryId, setCategoryId] = useState('')
  const [content, setContent] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [published, setPublished] = useState(true)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)

  const { data: categories = [] } = useCategories(POST_TYPE_BY_ROUTE[type])
  const { mutate, isPending, error } = useCreatePost(type)

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 서버와 같은 스키마로 검사해, 틀리면 요청을 보내지 않는다.
    const isTitleValid = createPostSchema.shape.title.safeParse(title).success
    // slug는 비워 두면 서버가 제목으로 생성하므로, 입력했을 때만 형식을 검사한다.
    const isSlugValid = !slug.trim() || slugSchema.safeParse(slug).success

    setTitleError(isTitleValid ? null : '제목을 입력하세요.')
    setSlugError(
      isSlugValid ? null : '글자·숫자를 하이픈(-)으로 이어서 입력하세요. (예: my-first-post)',
    )

    if (!isTitleValid || !isSlugValid) return

    mutate(
      {
        title,
        content,
        published,
        slug: slug.trim() || undefined,
        categoryId: categoryId || undefined,
        thumbnailUrl: thumbnail?.url,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      },
      { onSuccess: () => router.push(`/${type}`) },
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-bold">{heading}</h1>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-title" className={LABEL_CLASS}>
          제목
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? 'post-title-error' : undefined}
          className={INPUT_CLASS}
        />
        {titleError && (
          <p id="post-title-error" role="alert" className={ERROR_CLASS}>
            {titleError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-slug" className={LABEL_CLASS}>
          slug <span className="font-normal text-gray-500">(비우면 제목으로 자동 생성)</span>
        </label>
        <input
          id="post-slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          aria-invalid={Boolean(slugError)}
          aria-describedby={slugError ? 'post-slug-error' : undefined}
          className={INPUT_CLASS}
        />
        {slugError && (
          <p id="post-slug-error" role="alert" className={ERROR_CLASS}>
            {slugError}
          </p>
        )}
      </div>

      <ThumbnailField value={thumbnail} onChange={setThumbnail} />

      <div className="flex flex-col gap-2">
        <label htmlFor="post-category" className={LABEL_CLASS}>
          서브메뉴
        </label>
        <select
          id="post-category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className={INPUT_CLASS}
        >
          <option value="">미분류</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-meta-title" className={LABEL_CLASS}>
          메타 제목
        </label>
        <input
          id="post-meta-title"
          value={metaTitle}
          onChange={(event) => setMetaTitle(event.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-meta-description" className={LABEL_CLASS}>
          메타 설명
        </label>
        <textarea
          id="post-meta-description"
          value={metaDescription}
          onChange={(event) => setMetaDescription(event.target.value)}
          rows={3}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className={LABEL_CLASS}>본문</span>
        <RichTextEditor value={content} onChange={setContent} placeholder="내용을 입력하세요" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
        />
        공개 (해제하면 임시저장되어 목록에 나타나지 않습니다)
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}

export default PostForm
