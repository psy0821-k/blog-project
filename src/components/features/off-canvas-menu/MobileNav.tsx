import { MainMenu } from '@/lib/main-menu'
import { X } from 'lucide-react'
import Link from 'next/link'

interface Props {
  isOpen: boolean
  close: () => void
}

const MobileNav = ({ isOpen, close }: Props) => {
  return (
    <>
      {
        <nav
          id="mobile-nav"
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={`fixed inset-0 z-50 bg-white transition-transform duration-300 sm:hidden ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <h2 className="sr-only">모바일 메뉴</h2>
          <button className="absolute right-4 p-2" onClick={close}>
            <X aria-hidden />
          </button>
          <ul className="mt-10">
            {isOpen &&
              MainMenu.map((menu) => (
                <li key={menu.title}>
                  <Link
                    className="mobileMenuLink font-semibold"
                    href={menu.href}
                    onClick={close}
                    aria-label={`${menu.title} 이동하기`}
                  >
                    {menu.title}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      }
    </>
  )
}

export default MobileNav
