'use client'
import { useLayoutEffect, useRef, useState } from 'react'
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

const SEGMENT_POST_TYPE: Record<string, CategoryPostType> = {
  projects: 'PROJECT',
  lab: 'LAB',
}

const BASE_ITEM_CLASS = 'rounded-lg border border-gray-300 px-4 py-2 text-sm'
const ITEM_CLASS = `${BASE_ITEM_CLASS} shrink-0 min-[1440px]:w-full`
const CATEGORY_LINK_CLASS = `${BASE_ITEM_CLASS} min-w-0 flex-1 truncate`
const ACTIVE_ITEM_CLASS = 'border-gray-900 bg-gray-900 text-white'
const ADMIN_BUTTON_CLASS =
  'inline-flex h-9 w-12 shrink-0 items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100'

interface ListHeights {
  collapsed: number
  full: number
}

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
  const [isExpanded, setIsExpanded] = useState(false)
  const [heights, setHeights] = useState<ListHeights>({ collapsed: 0, full: 0 })
  const listRef = useRef<HTMLDivElement>(null)

  const { data: categories = [] } = useCategories(postType)
  const { create, update, remove } = useCategoryMutations(postType)

  const categoryCount = categories.length

  useLayoutEffect(() => {
    const list = listRef.current
    const firstItem = list?.firstElementChild

    if (!list || !(firstItem instanceof HTMLElement)) return

    const measure = () => {
      const next = { collapsed: firstItem.offsetHeight, full: list.offsetHeight }

      setHeights((prev) =>
        prev.collapsed === next.collapsed && prev.full === next.full ? prev : next,
      )
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(list)

    return () => observer.disconnect()
  }, [categoryCount, isAdmin, errorMessage])

  const isOverflowing = heights.full > heights.collapsed + 1
  // 한 줄로 줄어 더보기가 사라지면 펼침 상태도 함께 해제한다.
  const isOpen = isExpanded && isOverflowing
  const listHeight = isOpen ? heights.full : heights.collapsed

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

    // 보고 있던 서브메뉴를 지웠다면 전체 목록으로 돌아간다.
    if (activeSlug === category.slug) router.replace(`/${segment}`)
  }

  return (
    <nav aria-label="서브 메뉴" className="px-4 py-3 md:px-0">
      <div
        id="category-list"
        style={
          listHeight ? ({ '--list-height': `${listHeight}px` } as React.CSSProperties) : undefined
        }
        className="h-(--list-height) overflow-hidden transition-[height] duration-300 ease-out min-[1440px]:h-auto min-[1440px]:overflow-visible"
      >
        {/* 높이 측정은 높이가 고정되지 않는 안쪽 래퍼에서 한다 */}
        <div ref={listRef} className="flex flex-wrap gap-2 min-[1440px]:flex-col">
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
              <div
                key={category.id}
                className="flex shrink-0 items-center gap-1 min-[1440px]:w-full"
              >
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
        </div>
      </div>

      {isOverflowing && (
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="category-list"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-xs px-2 py-1 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 min-[1440px]:hidden"
        >
          {isOpen ? '접기' : '더보기'}
        </button>
      )}
    </nav>
  )
}

export default CategoryNav
