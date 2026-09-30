'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

const SCRAMBLE_TEXT = 'PLAYGROUND'

const HeroSection = () => {
  const textRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const el = textRef.current
    if (!el) return

    const mm = gsap.matchMedia()

    // 모션 허용일 때만 실행, 그 외에는 원래 글씨를 그대로 표시
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 글자 폭이 달라져 레이아웃이 흔들리지 않도록 최종 폭으로 고정
      gsap.set(el, { width: el.offsetWidth })

      gsap.to(el, {
        duration: 1.5,
        ease: 'none',
        onComplete: () => gsap.set(el, { clearProps: 'width' }), // 리사이즈 대응을 위해 고정 해제
        scrambleText: {
          text: SCRAMBLE_TEXT,
          chars: '@#S!FG',
          revealDelay: 0.3, // 이 시간 뒤부터 앞 글자부터 차례로 확정
          speed: 0.6,
        },
      })
    })
  })

  return (
    <section className="hero flex h-dvh items-center bg-linear-to-b from-blue-800 from-5% to-blue-600 to-95% sm:h-[80dvh]">
      <div className="content inner pl-8 pr-8">
        <h2 className="hero-title" aria-label="DEVELOPMENT PLAYGROUND">
          <p>DEVELOPMENT</p>
          <p>
            <span className="noWrap">
              <span ref={textRef} className="inline-block" aria-hidden="true">
                {SCRAMBLE_TEXT}
              </span>
              <svg
                className="pinwheel"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <g className="pinwheelSpin">
                  <path d="M50 50 L50 6 A22 22 0 0 1 72 28 Z" fill="#fde047" />
                  <path d="M50 50 L94 50 A22 22 0 0 1 72 72 Z" fill="#f97316" />
                  <path d="M50 50 L50 94 A22 22 0 0 1 28 72 Z" fill="#fde047" />
                  <path d="M50 50 L6 50 A22 22 0 0 1 28 28 Z" fill="#f97316" />
                </g>
              </svg>
            </span>
          </p>
        </h2>
      </div>
    </section>
  )
}

export default HeroSection
