'use client'

import { signOut } from 'next-auth/react'

import { useIsAdmin } from '@/hooks/use-admin-session'

// 관리자일 때만 인사말과 로그아웃을 보여준다. 모바일은 메뉴 하단, 데스크탑은 메뉴 옆 한 줄로 배치한다.
const AdminStatus = () => {
  const isAdmin = useIsAdmin()

  if (!isAdmin) return null

  return (
    <div className="border-t border-gray-100 p-4 sm:flex sm:items-center sm:gap-2 sm:border-0 sm:p-0 sm:text-sm">
      <p className="mb-2 text-sm sm:mb-0">관리자님 안녕하세요</p>

      <button
        type="button"
        className="rounded px-2 py-1 text-sm hover:bg-gray-100"
        onClick={() => signOut({ redirectTo: '/' })}
      >
        로그아웃
      </button>
    </div>
  )
}

export default AdminStatus
