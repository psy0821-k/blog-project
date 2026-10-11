'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

interface TypingTextProps {
  text: string
  /** 한 글자가 출력되는 간격(ms) */
  speed?: number
}

const TypingText = ({ text, speed = 80 }: TypingTextProps) => {
  const [count, setCount] = useState(0)
  // 움직임 줄이기 설정에서는 타이핑 없이 전체 텍스트를 바로 보여준다.
  const isReducedMotion = usePrefersReducedMotion()
  const visibleCount = isReducedMotion ? text.length : count
  const isTyping = visibleCount < text.length

  useEffect(() => {
    if (!isTyping) return
    const timer = setInterval(() => setCount((prev) => prev + 1), speed)
    return () => clearInterval(timer)
  }, [isTyping, speed])

  return (
    <span aria-label={text} className="relative inline-block whitespace-pre-line">
      {/* 완성된 텍스트로 자리를 먼저 확보해 타이핑 중 레이아웃이 흔들리지 않게 한다 */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {text.slice(0, visibleCount)}
        {isTyping && '|'}
      </span>
    </span>
  )
}

export default TypingText
