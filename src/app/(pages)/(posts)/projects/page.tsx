import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'
import DraftToggle from '@/components/pages/cardListPage/DraftToggle'
import SearchForm from '@/components/pages/cardListPage/SearchForm'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

const ProjectPage = () => {
  return (
    <div className="mt-8 sm:mt-10">
      <div className="px-4 md:px-0">
        <h1>프로젝트</h1>
        <div className="mt-2 sm:mt-3 xl:flex xl:items-center xl:justify-between xl:gap-6">
          <p>웹 개발 프로젝트부터 기술을 페이지로 만드는 작업하는 공간</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 xl:mt-0 xl:shrink-0 xl:justify-end">
            <AdminGuard>
              <Link
                href="/projects/write"
                className="inline-flex min-h-11 items-center whitespace-nowrap"
              >
                추가하기
              </Link>
            </AdminGuard>
            <Suspense fallback={null}>
              <DraftToggle />
            </Suspense>
            <Suspense fallback={null}>
              <SearchForm />
            </Suspense>
          </div>
        </div>
      </div>

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
