import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'

const ProjectPage = () => {
  return (
    <section>
      <h1 className="sr-only">프로젝트 페이지</h1>
      <AdminGuard>
        <Link href="/projects/write">프로젝트 추가하기</Link>
      </AdminGuard>

      <Suspense fallback={<p>불러오는 중...</p>}>
        <ListWrapper type={'projects'} />
      </Suspense>
    </section>
  )
}

export default ProjectPage
