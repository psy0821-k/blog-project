import React from 'react'

const BlogIntroSection = () => {
  return (
    <section className="content pt-30 pb-30 pl-8 pr-8 ">
      <h2 className="font-bold text-4xl mb-8 sm:text-5xl" aria-label="블로그 소개">
        Intro
      </h2>
      <p className="text-xl text-justify sm:text-2xl ">
        만들어 보고 싶은 것들을 하나씩 담아가는 공간입니다. 개발을 공부하며 떠오른 아이디어부터 작은
        토이 프로젝트, 인터랙티브한 실험과 아트워크까지 잘 만들어진 결과만 보여주기보다 무엇을
        생각했고, 어떻게 만들었는지 그리고 어떤 문제가 있었는지를 기록합니다. 아직은 작은 공간이지만
        하나씩 쌓이는 기록이 언젠가는 도움이 되고 찾아보고싶은 블로그가 되기를 바랍니다.
      </p>
    </section>
  )
}

export default BlogIntroSection
