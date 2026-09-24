import Image from 'next/image'

const ProjectPage = () => {
  return (
    <section>
      <h1>프로젝트 페이지</h1>
      <section>
        <h2>프로젝트 목록</h2>
        <ul>
          <li>
            <article>
              <Image
                src={'/fallback-image.jpg'}
                alt=""
                width={300}
                height={200}
                aria-hidden
              ></Image>
              <h3>프로젝트 타이틀</h3>
              <p>프로젝트 설명 길면 .......</p>
              <div className="tag-box flex gap-2">
                <div>next</div>
                <div>supabase</div>
              </div>
            </article>
          </li>
        </ul>
      </section>
    </section>
  )
}

export default ProjectPage
