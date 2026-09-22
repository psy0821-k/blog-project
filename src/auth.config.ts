import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

// Edge 런타임(middleware)에서도 로드되는 설정.
// PrismaAdapter 자체는 Node 런타임에서만 동작하는 auth.ts에서 주입한다.
export default {
  providers: [Google, GitHub],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
} satisfies NextAuthConfig
