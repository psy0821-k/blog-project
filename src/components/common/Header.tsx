import Link from 'next/link'
import { Search } from 'lucide-react'

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

        {/* <SearchButton /> */}
        <Search />
      </div>
    </header>
  )
}

export default Header
