import { Suspense } from 'react'
import CategoryNav from '@/components/features/category-nav/CategoryNav'

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="content min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
      <Suspense fallback={<nav aria-label="서브 메뉴" />}>
        <CategoryNav />
      </Suspense>
      <div>{children}</div>
    </main>
  )
}
