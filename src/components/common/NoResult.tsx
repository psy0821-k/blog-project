import Image from 'next/image'
import React from 'react'

const NoResult = () => {
  return (
    // 화면 세로 중앙에 오도록 위쪽 영역(Header 61px, 1440px 미만은 서브메뉴 줄 62px 추가)의 두 배를 뺀 높이를 최소 높이로 둔다.
    <section className="flex min-h-[calc(100dvh-246px)] flex-col items-center justify-center min-[1440px]:min-h-[calc(100dvh-122px)]">
      <Image
        src={'/no-result.webp'}
        alt=""
        width={300}
        height={400}
        loading="eager"
        className="h-auto w-auto"
      />
      <h1 className="mt-8">작성된 글이 없습니다</h1>
      <p className="mt-2 text-lg">조금만 기다려주세요 컨텐츠 준비 중 입니다</p>
    </section>
  )
}

export default NoResult
