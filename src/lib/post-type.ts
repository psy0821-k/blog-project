import type { CategoryPostType } from '@/hooks/use-categories'
import type { CreatePostType } from '@/hooks/use-create-post'

// 작성/수정 경로(type)와 서브메뉴(Category) DB의 글 종류 매핑. Projects와 Lab이 같은 폼 페이지를 재사용한다.
export const POST_TYPE_BY_ROUTE: Record<CreatePostType, CategoryPostType> = {
  projects: 'PROJECT',
  lab: 'LAB',
  devlog: 'DEV_LOG',
}
