'use client'

import { usePostList } from '@/hooks/use-post-list'

// TODO: 목록 구현 확인용 임시 페이지. 실제 목록 페이지를 구현한 뒤 이 폴더째 삭제한다.
export default function ListTestPage() {
  const { data, isLoading, isError } = usePostList('projects')

  return (
    <main className="content py-10">
      <h1 className="text-2xl font-bold">목록 테스트</h1>

      <div className="mt-6">
        {isLoading && <p>불러오는 중...</p>}
        {isError && <p>목록을 불러오지 못했습니다.</p>}

        {data && data.data.length === 0 && <p>컨텐츠가 없습니다.</p>}

        {data && data.data.length > 0 && (
          <ul className="space-y-2">
            {data.data.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
