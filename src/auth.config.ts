import type { NextAuthConfig, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

// Edge 런타임(middleware)에서도 로드되는 설정.
// PrismaAdapter 자체는 Node 런타임에서만 동작하는 auth.ts에서 주입한다.
export default {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    signIn({ user }) {
      // 운영자 1인만 로그인/가입을 허용한다. 그 외 이메일은 계정 생성 자체를 막는다.
      return user.email === process.env.ADMIN_EMAIL
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
} satisfies NextAuthConfig
