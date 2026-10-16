import { AlertCircle, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { signIn } from '@/auth'
import GoogleSignInButton from '@/components/features/login/GoogleSignInButton'
import { resolveLoginDestination } from '@/lib/admin-login-redirect'
import { getLoginErrorMessage } from '@/lib/login-messages'

export const metadata: Metadata = {
  title: '관리자 로그인',
  robots: { index: false },
}

type SearchParamValue = string | string[] | undefined

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: SearchParamValue; callbackUrl?: SearchParamValue; error?: SearchParamValue }>
}

function firstValue(value: SearchParamValue): string | undefined {
  return typeof value === 'string' ? value : value?.[0]
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  // 관리자 앱 로그인(/admin-login)으로 돌아올 수 있도록 내부 경로만 허용한다.
  // 로그인에 실패하면 Auth.js가 redirectTo 대신 callbackUrl을 붙이므로 그쪽도 읽어 다시 시도해도 목적지를 잃지 않는다.
  const destination = resolveLoginDestination(firstValue(params.redirectTo), firstValue(params.callbackUrl))
  const errorMessage = getLoginErrorMessage(firstValue(params.error))
  const isAdminAppLogin = destination.startsWith('/admin-login')

  return (
    <main className="content flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <section
        aria-labelledby="login-title"
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-700">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h1 id="login-title" className="mt-4">
            관리자 로그인
          </h1>
          <p className="mt-2 text-sm text-balance break-keep text-gray-600">
            {isAdminAppLogin
              ? '블로그 관리 앱에 로그인합니다. Google 계정으로 인증해 주세요.'
              : '블로그 운영자만 사용할 수 있습니다. Google 계정으로 인증해 주세요.'}
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="break-keep">{errorMessage}</p>
          </div>
        )}

        <form
          className="mt-6"
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: destination })
          }}
        >
          <GoogleSignInButton />
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          <Link href="/" className="underline underline-offset-2 hover:text-gray-700">
            블로그로 돌아가기
          </Link>
        </p>
      </section>
    </main>
  )
}
