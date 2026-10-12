import { Suspense } from 'react'
import DevlogListWrapper from '@/components/pages/devlogListPage/DevlogListWrapper'
import ListPageHeader from '@/components/pages/cardListPage/ListPageHeader'

const DevLogPage = () => {
  return (
    <main className="content mt-8 sm:mt-10">
      <ListPageHeader title="개발 일지" description="개발을 하면서 겪은 문제와 기록" writeHref="/devlog/write" />

      <div className="mt-8 sm:mt-10">
        <Suspense fallback={<p>불러오는 중...</p>}>
          <DevlogListWrapper />
        </Suspense>
      </div>
    </main>
  )
}

export default DevLogPage
