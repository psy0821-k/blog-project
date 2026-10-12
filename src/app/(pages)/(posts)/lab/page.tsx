import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'
import DraftToggle from '@/components/pages/cardListPage/DraftToggle'
import SearchForm from '@/components/pages/cardListPage/SearchForm'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

const LapPage = () => {
  return (
    <div>
      <h1>개발 실험실</h1>
      <div className="flex justify-between">
        <p>개발과 관련된 기술을 실험하고 학습하는 공간</p>
        <div className="flex justify-between gap-4">
          <AdminGuard>
            <Link href="/lab/write">추가하기</Link>
          </AdminGuard>
          <Suspense fallback={null}>
            <DraftToggle />
          </Suspense>
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </div>
      </div>
      <div className="min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
        <Suspense fallback={<nav aria-label="서브 메뉴" />}>
          <CategoryNav />
        </Suspense>
        <section>
          <Suspense fallback={<p>불러오는 중...</p>}>
            <ListWrapper type={'lab'} />
          </Suspense>
        </section>
      </div>
    </div>
  )
}

export default LapPage
