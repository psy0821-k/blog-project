'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import AdminGuard from '@/components/common/AdminGuard'

export const DraftToggle = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isDraft = searchParams.get('draft') === 'true'

  // 서브메뉴 선택은 유지하고, 목록이 바뀌므로 페이지 번호는 초기화한다.
  const nextParams = new URLSearchParams(searchParams)
  nextParams.delete('page')
  if (isDraft) nextParams.delete('draft')
  else nextParams.set('draft', 'true')

  const query = nextParams.toString()

  return (
    <AdminGuard>
      <Link href={query ? `${pathname}?${query}` : pathname}>
        {isDraft ? '발행된 글 보기' : '임시저장 목록'}
      </Link>
    </AdminGuard>
  )
}

export default DraftToggle
