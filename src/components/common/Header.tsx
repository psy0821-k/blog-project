import { Search } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="border border-b-gray-100">
      <div className="content flex justify-between h-15 items-center">
        <Link href={'/'} aria-label="홈으로 이동" className="font-bold text-2xl">
          PSY Dev Blog
        </Link>

        <nav className="globalNav flex gap-4">
          <Link href={'/projects'}>Projects</Link>
          <Link href={'/lab'}>Lab</Link>
          <Link href={'/devlog'}>DevLog</Link>
        </nav>

        <nav className="flex items-center">
          <button aria-label="검색">
            <Search />
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
