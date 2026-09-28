'use client'

import { useEffect, useState } from 'react'
import MobileNav from './MobileNav'
import { Menu } from 'lucide-react'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <button
        role="button"
        aria-label="메뉴 열기"
        onClick={() => {
          setIsOpen(true)
        }}
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        className="block sm:hidden"
      >
        <Menu aria-hidden />
      </button>

      <MobileNav
        isOpen={isOpen}
        close={() => {
          setIsOpen(false)
        }}
      />
    </>
  )
}

export default MobileMenu
