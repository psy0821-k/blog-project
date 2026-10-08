'use client'

import { useRouter } from 'next/navigation'

import type { CreatePostType } from '@/hooks/use-create-post'
import { useDeletePost } from '@/hooks/use-delete-post'

interface DeletePostButtonProps {
  type: CreatePostType
  slug: string
}

// 삭제 버튼. 브라우저 confirm으로 확인받은 뒤 삭제하고 목록으로 이동한다.
const DeletePostButton = ({ type, slug }: DeletePostButtonProps) => {
  const router = useRouter()
  const { mutate, isPending, error } = useDeletePost(type, slug)

  const handleDelete = () => {
    if (!window.confirm('정말 삭제할까요? 삭제한 글은 복구할 수 없습니다.')) return

    mutate(undefined, {
      onSuccess: () => {
        router.push(`/${type}`)
        router.refresh()
      },
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="w-fit text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {isPending ? '삭제 중...' : '삭제'}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default DeletePostButton
