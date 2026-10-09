import { Suspense } from 'react'
import DevlogListWrapper from '@/components/pages/devlogListPage/DevlogListWrapper'

const DevLogPage = () => {
  return (
    <main className="content">
      <h1>개발 일지</h1>
      <p>개발을 하면서 겪은 문제와 기록</p>

      <Suspense fallback={<p>불러오는 중...</p>}>
        <DevlogListWrapper />
      </Suspense>
    </main>
  )
}

export default DevLogPage
