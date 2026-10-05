'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import MobileMenu from '../features/off-canvas-menu/MobileMenu'
import { MainMenu } from '@/lib/main-menu'

const Header = () => {
  return (
    <header className="content border-b border-gray-100">
      <div className="flex h-15 items-center justify-between">
        <Link href="/" aria-label="홈으로 이동" className="p-2 text-[18px] font-bold sm:text-xl">
          PSY Dev Blog
        </Link>

        <nav className="hidden items-center gap-4 sm:flex">
          <h2 className="sr-only">메뉴</h2>
          <ul className="flex font-semibold">
            {MainMenu.map((menu) => (
              <li key={menu.title}>
                <Link className="p-2" href={menu.href} aria-label={`${menu.title} 이동하기`}>
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>
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
