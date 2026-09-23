import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">박성윤 개발 블로그</h1>
      <section>
        <h2>소개</h2>
        <p>
          사용자 중심의 경험과 성능을 고민하는 프론트엔드 개발자 박성윤입니다. 화면을 구현하고
          다양한 웹 기술과 기능을 실험하는 것을 좋아합니다. 누구나 제약 없이 사용할 수 있는 웹
          접근성과, 사용자 이탈을 막는 웹 성능 최적화를 개발의 핵심 가치로 둡니다. 단순한 신념에
          그치지 않고, 개인 블로그의 접근성 및 퍼포먼스 점수 100점을 목표로 직접 개선하며 성능과
          UX를 수치로 증명해 나가고 있습니다.
        </p>
      </section>
      <section>
        <h2>블로그 소개</h2>
        <p></p>
      </section>
    </main>
  )
}
