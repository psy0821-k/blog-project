import { useQuery } from '@tanstack/react-query'

interface SessionResponse {
  user?: { role?: string }
}

async function fetchSession(): Promise<SessionResponse | null> {
  const res = await fetch('/api/auth/session')

  if (!res.ok) {
    throw new Error(`세션을 불러오지 못했습니다. (${res.status})`)
  }

  // 로그아웃 상태에서는 NextAuth가 null 또는 빈 객체를 돌려준다.
  return res.json()
}

/** 현재 방문자가 ADMIN으로 로그인했는지 반환한다. 로딩 중이거나 실패하면 false. */
export function useIsAdmin() {
  const { data } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    // 세션은 자주 바뀌지 않으므로 탭 포커스마다 다시 요청하지 않는다.
    refetchOnWindowFocus: false,
  })

  return data?.user?.role === 'ADMIN'
}
