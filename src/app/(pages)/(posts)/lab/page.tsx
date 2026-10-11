import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'
import DraftToggle from '@/components/pages/cardListPage/DraftToggle'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

const LapPage = () => {
  return (
    <div className="min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
      <Suspense fallback={<nav aria-label="서브 메뉴" />}>
        <CategoryNav />
      </Suspense>
      <section>
        <h1 className="sr-only">실험실 페이지</h1>
        <div className="flex gap-4">
          <AdminGuard>
            <Link href="/lab/write">실험 프로젝트 추가하기</Link>
          </AdminGuard>
          <Suspense fallback={null}>
            <DraftToggle />
          </Suspense>
        </div>

        <Suspense fallback={<p>불러오는 중...</p>}>
          <ListWrapper type={'lab'} />
        </Suspense>
      </section>
    </div>
  )
}

export default LapPage
