import Image from 'next/image'
import React from 'react'

interface NoResultProps {
  keyword?: string
}

const NoResult = ({ keyword }: NoResultProps) => {
  return (
    <section className="flex min-h-[calc(100dvh-246px)] flex-col items-center justify-center min-[1440px]:min-h-[calc(100dvh-122px)]">
      {keyword ? (
        <>
          <Image
            src={'/no-search.webp'}
            alt=""
            width={200}
            height={300}
            loading="eager"
            className="h-auto w-50"
          />
          <h1 className="mt-8">&apos;{keyword}&apos; 검색 결과가 없습니다</h1>
          <p className="mt-2 text-lg">다시 한번 확인해주세요</p>
        </>
      ) : (
        <>
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
        </>
      )}
    </section>
  )
}

export default NoResult
