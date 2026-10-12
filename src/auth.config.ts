import type { NextAuthConfig, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import Google from 'next-auth/providers/google'
import { resolveRoleByEmail } from '@/lib/admin-role'

export default {
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // 운영자 1인만 로그인·가입을 허용한다. 이 콜백이 false면 계정도 만들어지지 않는다.
    // 구글이 이메일을 확인한 계정만 통과시켜, 같은 이메일을 사칭한 계정을 막는다.
    signIn({ user, profile }) {
      if (!user.email || profile?.email_verified !== true) return false

      return resolveRoleByEmail(user.email, process.env.ADMIN_EMAIL) === 'ADMIN'
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
