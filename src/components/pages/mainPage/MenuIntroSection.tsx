import React from 'react'
import Image from 'next/image'

const MenuIntroSection = () => {
  return (
    <section className="bg-gray-50">
      <div className="content pt-30 pb-30 pl-8 pr-8">
        <h2 className="font-bold text-4xl mb-8 sm:text-5xl">주요 메뉴 소개</h2>
        <article className="menu-intro-item">
          <Image
            aria-hidden
            src="/projects.svg"
            alt=""
            width={150}
            height={150}
            className="animate-[spin_8s_linear_infinite] motion-reduce:animate-none"
          />
          <div className="menu-intro-body">
            <h3 className="menu-intro-title">프로젝트</h3>
            <p>
              웹 프로젝트와 토이 프로젝트를 소개하는 공간입니다. 프로젝트의 목적과 구현 과정, 사용한
              기술과 결과물을 함께 기록합니다.
            </p>
          </div>
        </article>

        <article className="menu-intro-item">
          <Image
            aria-hidden
            src="/lab.svg"
            alt=""
            width={150}
            height={150}
            className="origin-bottom animate-[swing_1s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          <div className="menu-intro-body">
            <h3 className="menu-intro-title">실험실</h3>
            <p className="sm:text-[1.25em]">
              새로운 기능과 인터랙션을 자유롭게 실험하는 공간입니다. 작은 아이디어부터 다양한 UI와
              기술을 직접 구현하며 결과를 기록합니다.
            </p>
          </div>
        </article>

        <article className="menu-intro-item">
          <Image
            aria-hidden
            src="/devlog.svg"
            alt=""
            width={150}
            height={150}
            className="animate-[write_2s_ease-in-out_infinite] motion-reduce:animate-none"
          />
          <div className="menu-intro-body">
            <h3 className="menu-intro-title">개발로그</h3>
            <p>
              프로젝트와 기능을 개발하며 겪은 문제와 해결 과정을 기록합니다. 시행착오와 고민, 새롭게
              알게 된 내용을 개발 기록으로 남깁니다.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default MenuIntroSection
