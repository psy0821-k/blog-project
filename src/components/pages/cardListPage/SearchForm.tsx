'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export const SearchForm = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const keyword = searchParams.get('q') ?? ''

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = new FormData(event.currentTarget).get('q')
    const nextKeyword = typeof input === 'string' ? input.trim() : ''

    // 서브메뉴·임시저장 상태는 유지하고, 결과가 바뀌므로 페이지 번호는 초기화한다.
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('page')
    if (nextKeyword) nextParams.set('q', nextKeyword)
    else nextParams.delete('q')

    const query = nextParams.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    // 주소의 검색어가 바뀌면(뒤로 가기 등) 입력값도 함께 바뀌도록 key로 폼을 다시 만든다.
    <form key={keyword} role="search" onSubmit={handleSubmit} className="flex w-full items-center gap-2 xl:w-auto">
      <label htmlFor="post-search" className="sr-only">
        제목 검색
      </label>
      <input
        id="post-search"
        name="q"
        type="search"
        defaultValue={keyword}
        placeholder="제목 검색"
        className="min-h-11 min-w-0 flex-1 rounded border border-gray-300 px-3 py-1 xl:w-56 xl:flex-none"
      />
      <button type="submit" className="min-h-11 shrink-0 px-2">검색</button>
    </form>
  )
}

export default SearchForm
