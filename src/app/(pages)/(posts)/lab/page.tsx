import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import ListPageHeader from '@/components/pages/cardListPage/ListPageHeader'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

const LapPage = () => {
  return (
    <div className="mt-8 sm:mt-10">
      <ListPageHeader title="개발 실험실" description="개발과 관련된 기술을 실험하고 학습하는 공간" writeHref="/lab/write" />

      <div className="mt-8 sm:mt-10 min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
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
