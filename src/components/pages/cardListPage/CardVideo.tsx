'use client'

import { useEffect, useRef } from 'react'

interface CardVideoProps {
  src: string
}

const CardVideo = ({ src }: CardVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const card = video?.closest('a')

    if (!video || !card) return

    const play = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // 자동 재생이 거부되어도 목록 표시에는 영향이 없으므로 오류는 무시한다.
      video.play().catch(() => undefined)
    }

    const stop = () => {
      video.pause()
      video.currentTime = 0
    }

    card.addEventListener('mouseenter', play)
    card.addEventListener('mouseleave', stop)
    card.addEventListener('focus', play)
    card.addEventListener('blur', stop)

    return () => {
      card.removeEventListener('mouseenter', play)
      card.removeEventListener('mouseleave', stop)
      card.removeEventListener('focus', play)
      card.removeEventListener('blur', stop)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={`${src}#t=0.001`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      className="w-full h-full object-contain"
    />
  )
}

export default CardVideo
