import { signIn } from '@/auth'

export default function LoginPage() {
  return (
    <main>
      <h1>로그인</h1>
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/' })
        }}
      >
        <button type="submit">Google로 로그인</button>
      </form>
    </main>
  )
}
