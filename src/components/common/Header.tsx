'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import MobileMenu from '../features/off-canvas-menu/MobileMenu'

const Header = () => {
  return (
    <header className="content border-b border-gray-100">
      <div className="flex h-15 items-center justify-between">
        <Link href="/" aria-label="홈으로 이동" className="p-2 text-[18px] font-bold sm:text-2xl">
          PSY Dev Blog
        </Link>

        <nav className="hidden items-center gap-4 sm:flex">
          <Link className="p-2" href="/projects">
            Projects
          </Link>

          <Link className="p-2" href="/lab">
            Lab
          </Link>

          <Link className="p-2" href="/devlog">
            DevLog
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="검색 열기"
            className="flex size-11 items-center justify-center rounded-full"
          >
            <Search aria-hidden="true" />
          </button>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
