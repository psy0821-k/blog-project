import { Suspense } from 'react'
import ListWrapper from '@/components/pages/cardListPage/ListWrapper'

const ProjectPage = () => {
  return (
    <section>
      <h1 className="sr-only">프로젝트 페이지</h1>

      <Suspense fallback={<p>불러오는 중...</p>}>
        <ListWrapper type={'projects'} />
      </Suspense>
    </section>
  )
}

export default ProjectPage
