import { Search } from 'lucide-react'
import Link from 'next/link'
import { auth, signOut } from '@/auth'

const Header = async () => {
  const session = await auth()

  return (
    <header>
      <Link href={'/'} aria-label="홈으로 이동">
        PSY Dev Blog
      </Link>

      <nav className="globalNav flex">
        <Link href={'/projects'}>Projects</Link>
        <Link href={'/lab'}>Lab</Link>
        <Link href={'/devlog'}>DevLog</Link>
      </nav>

      <nav>
        <button aria-label="검색">
          <Search />
        </button>
        {session?.user ? (
          <>
            <span>{session.user.name}님</span>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}
            >
              <button type="submit">로그아웃</button>
            </form>
          </>
        ) : (
          <Link href={'/login'} aria-label="로그인하기">
            Login
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
