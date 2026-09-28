import { MainMenu } from '@/lib/main-menu'
import { X } from 'lucide-react'
import Link from 'next/link'

interface Props {
  isOpen: boolean
  close: () => void
}

const MobileNav = ({ isOpen, close }: Props) => {
  return (
    <div>
      {
        <nav
          id="mobile-nav"
          className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button className="absolute right-4 p-2" onClick={close}>
            <X aria-hidden />
          </button>
          <ul className="mt-10">
            {isOpen &&
              MainMenu.map((menu) => (
                <li key={menu.title}>
                  <Link
                    className="mobileMenuLink"
                    href={menu.href}
                    aria-label={`${menu.title} 이동하기`}
                  >
                    {menu.title}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      }
    </div>
  )
}

export default MobileNav
