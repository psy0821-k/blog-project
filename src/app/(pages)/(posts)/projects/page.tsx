import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import ListPageHeader from '@/components/pages/cardListPage/ListPageHeader'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

const ProjectPage = () => {
  return (
    <div className="mt-8 sm:mt-10">
      <ListPageHeader title="프로젝트" description="웹 개발 프로젝트부터 기술을 페이지로 만드는 작업하는 공간" writeHref="/projects/write" />

      <div className="mt-8 sm:mt-10 min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
        <Suspense fallback={<nav aria-label="서브 메뉴" />}>
          <CategoryNav />
        </Suspense>
        <section>
          <Suspense fallback={<p>불러오는 중...</p>}>
            <ListWrapper type={'projects'} />
          </Suspense>
        </section>
      </div>
    </div>
  )
}

export default ProjectPage
