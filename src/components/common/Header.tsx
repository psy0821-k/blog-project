'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import AdminStatus from '@/components/common/AdminStatus'
import { MainMenu } from '@/lib/main-menu'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    let timerId: number

    const handleResize = () => {
      setIsResizing(true)

      if (window.innerWidth >= 640) {
        setIsMenuOpen(false)
      }

      window.clearTimeout(timerId)
      timerId = window.setTimeout(() => setIsResizing(false), 150)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.clearTimeout(timerId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <header className="border-b border-gray-100 pl-2 pr-2">
      <div className="content flex h-15 items-center justify-between">
        <Link href="/" aria-label="홈으로 이동" className="font-bold text-[18px] sm:text-xl">
          PSY Dev Blog
        </Link>

        <nav
          className={`fixed inset-y-0 right-0 z-50 w-[80%] max-w-sm bg-white shadow-xl ease-out
            sm:static sm:z-auto sm:flex sm:w-auto sm:max-w-none sm:items-center sm:gap-4 sm:bg-transparent sm:shadow-none sm:transition-none
            ${isResizing ? 'transition-none' : 'transition-transform duration-300'}
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'}`}
        >
          <div className="flex h-15 items-center justify-between border-b border-gray-100 px-4 sm:hidden">
            <span className="font-bold">PSY Dev Blog</span>

            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={closeMenu}
              className="rounded p-2 hover:bg-gray-100"
            >
              <X size={22} />
            </button>
          </div>

          <ul className="flex flex-col font-semibold sm:flex-row sm:items-center">
            {MainMenu.map((menu) => (
              <li key={menu.title}>
                <Link
                  href={menu.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 hover:bg-gray-100 sm:px-3 sm:py-2"
                >
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>

          <AdminStatus />
        </nav>

        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
          className="rounded p-2 hover:bg-gray-100 sm:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={closeMenu}
        className={`
          fixed inset-0 z-40
          bg-black/30
          transition-opacity duration-300
          sm:hidden
          ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
        `}
      />
    </header>
  )
}

export default Header
