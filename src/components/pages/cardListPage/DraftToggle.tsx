'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import AdminGuard from '@/components/common/AdminGuard'

export const DraftToggle = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isDraft = searchParams.get('draft') === 'true'

  const nextParams = new URLSearchParams(searchParams)
  nextParams.delete('page')
  if (isDraft) nextParams.delete('draft')
  else nextParams.set('draft', 'true')

  const query = nextParams.toString()

  return (
    <AdminGuard>
      <Link
        href={query ? `${pathname}?${query}` : pathname}
        className="inline-flex min-h-11 items-center whitespace-nowrap"
      >
        {isDraft ? '발행된 글' : '임시저장 목록'}
      </Link>
    </AdminGuard>
  )
}

export default DraftToggle
