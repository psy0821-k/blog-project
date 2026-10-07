import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useCategoryMutations, type Category, type CategoryPostType } from '@/hooks/use-categories'

interface UseCategoryActionsParams {
  postType: CategoryPostType
  segment: string
  activeSlug: string | null
}

export const useCategoryActions = ({ postType, segment, activeSlug }: UseCategoryActionsParams) => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { create, update, remove } = useCategoryMutations(postType)

  const runMutation = async (action: () => Promise<unknown>) => {
    setErrorMessage(null)

    try {
      await action()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '요청에 실패했습니다.')
    }
  }

  const handleCreate = async () => {
    const name = window.prompt('서브메뉴 이름을 입력하세요.')?.trim()

    if (name) await runMutation(() => create.mutateAsync(name))
  }

  const handleRename = async (category: Category) => {
    const name = window.prompt('새 서브메뉴 이름을 입력하세요.', category.name)?.trim()

    if (name && name !== category.name)
      await runMutation(() => update.mutateAsync({ id: category.id, name }))
  }

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(
        `'${category.name}' 서브메뉴를 삭제할까요?\n속한 글은 삭제되지 않고 미분류로 바뀝니다.`,
      )
    )
      return

    await runMutation(() => remove.mutateAsync(category.id))

    if (activeSlug === category.slug) router.replace(`/${segment}`)
  }

  return { errorMessage, handleCreate, handleRename, handleDelete }
}
