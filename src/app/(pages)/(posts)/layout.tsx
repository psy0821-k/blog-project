import { Suspense } from 'react'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

// Projects/Lab 목록·상세가 공유하는 본문 영역. Header는 루트 레이아웃에서 이미 렌더링하므로 여기서 다시 두지 않는다.
// 서브메뉴(카테고리)는 1440px 이상에서 왼쪽 사이드바, 그 미만에서는 목록 위 가로 스크롤 줄로 배치한다.
// 추가/수정/삭제 버튼은 CategoryNav가 useIsAdmin으로 판단해 ADMIN에게만 보여준다(실제 권한 검증은 API가 한다).
export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="content min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
      <Suspense fallback={<nav aria-label="서브 메뉴" />}>
        <CategoryNav />
      </Suspense>
      <div>{children}</div>
    </main>
  )
}
