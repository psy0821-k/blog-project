import { signIn } from '@/auth'
import { sanitizeInternalPath } from '@/lib/admin-login-redirect'

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string | string[] }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams
  // 관리자 앱 로그인(/admin-login)으로 돌아올 수 있도록 내부 경로만 허용한다.
  const destination = sanitizeInternalPath(typeof redirectTo === 'string' ? redirectTo : undefined)

  return (
    <main>
      <h1>로그인</h1>
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo: destination })
        }}
      >
        <button type="submit">Google로 로그인</button>
      </form>
    </main>
  )
}
