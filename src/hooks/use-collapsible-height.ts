import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

interface Heights {
  collapsed: number
  full: number
}

interface CollapsibleHeight<T extends HTMLElement> {
  contentRef: RefObject<T | null>
  isOverflowing: boolean
  isOpen: boolean
  height: number
  toggle: () => void
}

export const useCollapsibleHeight = <T extends HTMLElement>(): CollapsibleHeight<T> => {
  const contentRef = useRef<T>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [heights, setHeights] = useState<Heights>({ collapsed: 0, full: 0 })

  useLayoutEffect(() => {
    const content = contentRef.current
    const firstItem = content?.firstElementChild

    if (!content || !(firstItem instanceof HTMLElement)) return

    const measure = () => {
      const next = { collapsed: firstItem.offsetHeight, full: content.offsetHeight }

      setHeights((prev) =>
        prev.collapsed === next.collapsed && prev.full === next.full ? prev : next,
      )
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(content)

    return () => observer.disconnect()
  }, [])

  const isOverflowing = heights.full > heights.collapsed + 1
  const isOpen = isExpanded && isOverflowing

  return {
    contentRef,
    isOverflowing,
    isOpen,
    height: isOpen ? heights.full : heights.collapsed,
    toggle: () => setIsExpanded((prev) => !prev),
  }
}
