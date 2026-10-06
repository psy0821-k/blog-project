'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import MobileMenu from '../features/off-canvas-menu/MobileMenu'
import { useIsAdmin } from '@/hooks/use-admin-session'
import { MainMenu } from '@/lib/main-menu'

const Header = () => {
  const isAdmin = useIsAdmin()

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
          {isAdmin && (
            <div className="flex items-center gap-2 text-sm">
              <p>관리자님 안녕하세요</p>
              {/* 전체 새로고침을 겸해 세션 캐시를 비우고 홈으로 이동한다. */}
              <button
                type="button"
                className="rounded px-2 py-1 hover:bg-gray-100"
                onClick={() => signOut({ redirectTo: '/' })}
              >
                로그아웃
              </button>
            </div>
          )}
        </nav>

        <div className="flex items-center mr-4 sm:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
