import Image from 'next/image'
import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <main>
      <section className="content flex flex-col items-center py-16 text-center">
        {/* 이미지가 일렁이는 노이즈 필터. 정의만 담고 화면에는 나타나지 않는다. */}
        <svg className={styles.filterDefs} aria-hidden="true" focusable="false">
          <filter id="not-found-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={1} seed={1} />
            <feDisplacementMap
              in="SourceGraphic"
              xChannelSelector="B"
              yChannelSelector="G"
              scale={70}
            >
              <animate
                attributeName="scale"
                dur="8s"
                values="70;-70;70"
                keyTimes="0;0.5;1"
                calcMode="spline"
                keySplines="0.37 0 0.63 1; 0.37 0 0.63 1"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </svg>

        <div className={styles.frame}>
          <Image
            className={styles.image}
            src="/not-found.webp"
            alt=""
            width={568}
            height={472}
            aria-hidden
            priority
          />
        </div>
        <h1 className="mt-8">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-lg">주소가 바뀌었거나 삭제된 페이지입니다.</p>
        <Link href="/" className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white">
          홈으로 돌아가기
        </Link>
      </section>
    </main>
  )
}
