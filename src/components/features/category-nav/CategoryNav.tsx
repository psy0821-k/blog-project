'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCategories, type CategoryPostType } from '@/hooks/use-categories'
import { useCategoryActions } from '@/hooks/use-category-actions'
import { useCollapsibleHeight } from '@/hooks/use-collapsible-height'

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
  const searchParams = useSearchParams()
  const activeSlug = searchParams.get('category')

  const { data: categories = [] } = useCategories(postType)
  const { errorMessage, handleCreate, handleRename, handleDelete } = useCategoryActions({
    postType,
    segment,
    activeSlug,
  })
  const {
    contentRef,
    isOverflowing,
    isOpen,
    height: listHeight,
    toggle,
  } = useCollapsibleHeight<HTMLDivElement>()

  return (
    <nav aria-label="서브 메뉴" className="px-4 py-3 md:px-0">
      <div
        id="category-list"
        style={
          listHeight ? ({ '--list-height': `${listHeight}px` } as React.CSSProperties) : undefined
        }
        className="h-(--list-height) overflow-hidden transition-[height] duration-300 ease-out min-[1440px]:h-auto min-[1440px]:overflow-visible"
      >
        <div ref={contentRef} className="flex flex-wrap gap-2 min-[1440px]:flex-col">
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
          onClick={toggle}
          className="mt-2 text-xs px-2 py-1 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 min-[1440px]:hidden"
        >
          {isOpen ? '접기' : '더보기'}
        </button>
      )}
    </nav>
  )
}

export default CategoryNav
