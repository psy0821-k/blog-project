import { Suspense } from 'react'
import DevlogListWrapper from '@/components/pages/devlogListPage/DevlogListWrapper'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'
import DraftToggle from '@/components/pages/cardListPage/DraftToggle'
import SearchForm from '@/components/pages/cardListPage/SearchForm'

const DevLogPage = () => {
  return (
    <main className="content">
      <h1>개발 일지</h1>
      <div className="flex justify-between">
        <p>개발을 하면서 겪은 문제와 기록</p>
        <div className="flex gap-4">
          <AdminGuard>
            <Link href={'/devlog/write'}>글쓰기</Link>
          </AdminGuard>
          <Suspense fallback={null}>
            <DraftToggle />
          </Suspense>
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<p>불러오는 중...</p>}>
        <DevlogListWrapper />
      </Suspense>
    </main>
  )
}

export default DevLogPage
