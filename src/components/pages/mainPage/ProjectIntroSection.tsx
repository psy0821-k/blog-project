'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 1,
    title: '프로젝트 1',
    description: '프로젝트 설명을 입력하세요.',
    src: '/no-project.webp',
  },
  {
    id: 2,
    title: '프로젝트 2',
    description: '프로젝트 설명을 입력하세요.',
    src: '/no-project.webp',
  },
  {
    id: 3,
    title: '프로젝트 3',
    description: '프로젝트 설명을 입력하세요.',
    src: '/no-project.webp',
  },
  {
    id: 4,
    title: '프로젝트 4',
    description: '프로젝트 설명을 입력하세요.',
    src: '/no-project.webp',
  },
]

const ProjectIntroSection = () => {
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

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const getScrollDistance = () => track.scrollWidth - viewport.clientWidth

        gsap.set(viewport, { overflow: 'hidden' })
        gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollDistance() * 0.5}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative md:h-dvh">
      <div className="flex flex-col py-16 md:h-full ">
        <div className="content pt-30">
          <h2 className="mb-8 pl-8 pr-8 text-3xl font-bold sm:text-4xl">최근 프로젝트</h2>
        </div>
        <div ref={viewportRef} className="overflow-x-auto md:min-h-0 md:flex-1">
          <div ref={trackRef} className="flex flex-col md:h-full md:w-max md:flex-row">
            {PROJECTS.map((project) => (
              <article
                key={project.id}
                className="flex flex-col items-center justify-center  text-center md:w-screen md:shrink-0"
              >
                {/* 패널(section 높이) 기준 약 65%, 16:9 가로형 */}
                <div className="relative mb-6 aspect-video w-4/5 md:h-[65%] md:w-auto">
                  <Image
                    src={project.src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 768px) 60vw, 80vw"
                    className="rounded-lg object-cover"
                  />
                </div>
                <Link href={'#'} aria-label={`${project.title}로 이동하기`}>
                  <h3 className="mb-2 text-2xl font-bold sm:text-3xl">{project.title}</h3>
                  <p className="text-lg">{project.description}</p>
                </Link>
              </article>
            ))}
          </div>
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

export default ProjectIntroSection
