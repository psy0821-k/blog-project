import { useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener('change', onChange)

  return () => mediaQuery.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches

// 서버에서는 알 수 없으므로 움직임을 줄이지 않는 것으로 보고, 클라이언트에서 실제 설정으로 맞춘다.
const getServerSnapshot = () => false

/** 사용자가 OS/브라우저에서 움직임 줄이기를 켰는지 반환한다. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
