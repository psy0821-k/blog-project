import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'

const LabPage = () => {
  return (
    <section>
      <h1 className="sr-only">랩 페이지</h1>
      <Suspense fallback={<p>불러오는 중...</p>}>
        <ListWrapper type="lab" />
      </Suspense>
    </section>
  )
}

export default LabPage
