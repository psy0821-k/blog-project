'use client'

import Image from 'next/image'
import { usePostList } from '@/hooks/use-post-list'

const ProjectPage = () => {
  const { data, isLoading, isError } = usePostList('projects')

  return (
    <section>
      <h1>프로젝트 페이지</h1>
      <section>
        <h2>프로젝트 목록</h2>

        {isLoading && <p>불러오는 중...</p>}
        {isError && <p>프로젝트 목록을 불러오지 못했습니다.</p>}

        {data && (
          <ul>
            {data.data.map((post) => (
              <li key={post.id}>
                <article>
                  <Image
                    src={post.thumbnailUrl || '/fallback-image.jpg'}
                    alt=""
                    width={300}
                    height={200}
                    aria-hidden
                  ></Image>
                  <h3>{post.title}</h3>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

export default ProjectPage
