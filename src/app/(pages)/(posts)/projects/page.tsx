import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

const ProjectPage = () => {
  return (
    <div className="min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
      <Suspense fallback={<nav aria-label="서브 메뉴" />}>
        <CategoryNav />
      </Suspense>
      <section>
        <h1 className="sr-only">프로젝트 페이지</h1>
        <AdminGuard>
          <Link href="/projects/write">프로젝트 추가하기</Link>
        </AdminGuard>

        <Suspense fallback={<p>불러오는 중...</p>}>
          <ListWrapper type={'projects'} />
        </Suspense>
      </section>
    </div>
  )
}

export default ProjectPage
