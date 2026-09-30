'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PANELS = [
  { id: 1, title: 'Panel 1', description: '세로 스크롤이 가로 이동으로 바뀝니다.' },
  { id: 2, title: 'Panel 2', description: 'pin으로 섹션을 고정하고 track을 x축으로 이동합니다.' },
  { id: 3, title: 'Panel 3', description: 'scrub으로 스크롤 진행률과 이동을 연결합니다.' },
  { id: 4, title: 'Panel 4', description: '이동 거리 = track 전체 너비 - viewport 너비' },
]

const HorizontalScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const viewport = viewportRef.current
      const track = trackRef.current
      const progress = progressRef.current
      if (!section || !viewport || !track || !progress) return

      const mm = gsap.matchMedia()

      // 데스크탑 + 모션 허용일 때만 가로 스크롤 연출, 그 외에는 세로로 쌓인 기본 레이아웃 유지
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        // 가로 이동 거리: track 전체 너비에서 화면에 보이는 너비를 뺀 값
        const getScrollDistance = () => track.scrollWidth - viewport.clientWidth

        // 네이티브 가로 스크롤바 대신 GSAP가 이동을 담당
        gsap.set(viewport, { overflow: 'hidden' })

        // 진행 바는 width 대신 scaleX로 (리플로우 방지), 왼쪽부터 차오르게
        gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

        const scrollTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none', // 스크롤과 선형으로 따라와야 자연스럽다
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`, // 가로 이동 거리만큼 세로 스크롤
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true, // 리사이즈 시 x, end 재계산
            markers: true,
            snap: 1 / (PANELS.length - 1), // 패널 경계(0, 1/3, 2/3, 1)로 스냅
            onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
          },
        })

        // 패널이 화면에 들어올 때 제목 등장 (가로 이동 트윈을 기준으로 위치 계산)
        gsap.utils.toArray<HTMLElement>('.hscroll-panel').forEach((panel) => {
          gsap.from(panel.querySelector('.hscroll-title'), {
            autoAlpha: 0,
            y: 40,
            duration: 0.6,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left 80%', // 패널의 왼쪽 끝이 화면 너비의 80% 지점에 닿을 때
              toggleActions: 'play none none reverse',
            },
          })
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative">
      <div ref={viewportRef} className="overflow-x-auto md:h-dvh">
        <div ref={trackRef} className="flex flex-col md:h-full md:w-max md:flex-row">
          {PANELS.map((panel) => (
            <article
              key={panel.id}
              className="hscroll-panel flex flex-col items-center justify-center p-8 text-center md:h-full md:w-screen md:shrink-0"
            >
              <h3 className="hscroll-title mb-4 text-5xl font-bold">{panel.title}</h3>
              <p className="text-xl">{panel.description}</p>
            </article>
          ))}
        </div>
      </div>
      <div
        ref={progressRef}
        aria-hidden
        className="absolute bottom-0 left-0 hidden h-1 w-full bg-blue-600 md:block"
      />
    </section>
  )
}

export default HorizontalScrollSection
