import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'

const LapPage = () => {
  return (
    <section>
      <h1 className="sr-only">실험실 페이지</h1>
      <AdminGuard>
        <Link href="/lab/write">실험 프로젝트 추가하기</Link>
      </AdminGuard>

      <Suspense fallback={<p>불러오는 중...</p>}>
        <ListWrapper type={'lab'} />
      </Suspense>
    </section>
  )
}

export default LapPage
