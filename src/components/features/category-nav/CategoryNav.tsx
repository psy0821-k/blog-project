'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  useCategories,
  useCategoryMutations,
  type Category,
  type CategoryPostType,
} from '@/hooks/use-categories'

interface CategoryNavProps {
  isAdmin: boolean
}

// 서브메뉴를 제공하는 경로(첫 세그먼트)와 글 종류 매핑. 목록·상세가 같은 서브메뉴를 공유한다.
const SEGMENT_POST_TYPE: Record<string, CategoryPostType> = {
  projects: 'PROJECT',
  lab: 'LAB',
}

const BASE_ITEM_CLASS = 'rounded-lg border border-gray-300 px-4 py-2 text-sm'
// 사이드바(1440px 이상)에서는 항목이 한 줄을 꽉 채우고, 가로 스크롤 줄에서는 내용 폭만큼만 차지한다.
const ITEM_CLASS = `${BASE_ITEM_CLASS} shrink-0 min-[1440px]:w-full`
// 수정/삭제 버튼이 있는 항목은 링크가 남는 폭을 채워, 버튼 크기가 이름 길이와 무관하게 고정된다.
const CATEGORY_LINK_CLASS = `${BASE_ITEM_CLASS} min-w-0 flex-1 truncate`
const ACTIVE_ITEM_CLASS = 'border-gray-900 bg-gray-900 text-white'
const ADMIN_BUTTON_CLASS =
  'inline-flex h-9 w-12 shrink-0 items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100'

export const CategoryNav = ({ isAdmin }: CategoryNavProps) => {
  const pathname = usePathname()
  const segment = pathname.split('/')[1] ?? ''
  const postType = SEGMENT_POST_TYPE[segment]

  if (!postType) return null

  return <CategoryNavList segment={segment} postType={postType} isAdmin={isAdmin} />
}

interface CategoryNavListProps {
  segment: string
  postType: CategoryPostType
  isAdmin: boolean
}

const CategoryNavList = ({ segment, postType, isAdmin }: CategoryNavListProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSlug = searchParams.get('category')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: categories = [] } = useCategories(postType)
  const { create, update, remove } = useCategoryMutations(postType)

  const runMutation = async (action: () => Promise<unknown>) => {
    setErrorMessage(null)

    try {
      await action()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '요청에 실패했습니다.')
    }
  }

  // 에디터의 askText 패널은 Quill 모듈을 함께 불러와 서버 렌더링에서 깨지므로 브라우저 기본 입력창을 쓴다.
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

    // 보고 있던 서브메뉴를 지웠다면 전체 목록으로 돌아간다.
    if (activeSlug === category.slug) router.replace(`/${segment}`)
  }

  return (
    <nav
      aria-label="서브 메뉴"
      className="flex gap-2 overflow-x-auto px-4 py-3 md:px-0 min-[1440px]:flex-col min-[1440px]:overflow-visible"
    >
      <Link
        href={`/${segment}`}
        aria-current={!activeSlug ? 'page' : undefined}
        className={`${ITEM_CLASS} ${!activeSlug ? ACTIVE_ITEM_CLASS : ''}`}
      >
        전체
      </Link>

      {categories.map((category) => {
        const isActive = activeSlug === category.slug

        return (
          <div key={category.id} className="flex shrink-0 items-center gap-1 min-[1440px]:w-full">
            <Link
              href={`/${segment}?category=${category.slug}`}
              aria-current={isActive ? 'page' : undefined}
              className={`${CATEGORY_LINK_CLASS} ${isActive ? ACTIVE_ITEM_CLASS : ''}`}
            >
              {category.name}
            </Link>
            {isAdmin && (
              <>
                <button
                  type="button"
                  className={ADMIN_BUTTON_CLASS}
                  aria-label={`${category.name} 수정`}
                  onClick={() => handleRename(category)}
                >
                  수정
                </button>
                <button
                  type="button"
                  className={ADMIN_BUTTON_CLASS}
                  aria-label={`${category.name} 삭제`}
                  onClick={() => handleDelete(category)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )
      })}

      {isAdmin && (
        <button
          type="button"
          className={`${ITEM_CLASS} border-dashed text-gray-500`}
          onClick={handleCreate}
        >
          + 추가
        </button>
      )}

      {errorMessage && (
        <p role="alert" className="shrink-0 self-center text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </nav>
  )
}

export default CategoryNav
