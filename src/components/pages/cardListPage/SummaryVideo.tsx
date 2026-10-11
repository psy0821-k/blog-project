'use client'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

interface SummaryVideoProps {
  src: string
  className?: string
}

export const SummaryVideo = ({ src, className }: SummaryVideoProps) => {
  // 움직임 줄이기 설정에서는 자동 재생하지 않고 첫 프레임만 보여준다.
  const isReducedMotion = usePrefersReducedMotion()

  return (
    <video
      src={`${src}#t=0.001`}
      autoPlay={!isReducedMotion}
      muted
      loop
      playsInline
      controls
      preload="metadata"
      className={className}
    />
  )
}

export default SummaryVideo
