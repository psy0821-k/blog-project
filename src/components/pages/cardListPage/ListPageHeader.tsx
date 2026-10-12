import { Suspense } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/common/AdminGuard'
import DraftToggle from './DraftToggle'
import SearchForm from './SearchForm'

interface ListPageHeaderProps {
  title: string
  description: string
  writeHref: string
}

export const ListPageHeader = ({ title, description, writeHref }: ListPageHeaderProps) => {
  return (
    <div className="px-4 md:px-0">
      <h1>{title}</h1>
      <div className="mt-2 sm:mt-3 xl:flex xl:items-center xl:justify-between xl:gap-6">
        <p>{description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 xl:mt-0 xl:shrink-0 xl:justify-end">
          <AdminGuard>
            <Link href={writeHref} className="inline-flex min-h-11 items-center whitespace-nowrap">
              추가하기
            </Link>
          </AdminGuard>
          <Suspense fallback={null}>
            <DraftToggle />
          </Suspense>
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ListPageHeader
