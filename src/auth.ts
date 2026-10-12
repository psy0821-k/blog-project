import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { resolveRoleByEmail } from '@/lib/admin-role'
import { prisma } from '@/lib/prisma'

const prismaAdapter = PrismaAdapter(prisma)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...prismaAdapter,
    // 운영자(ADMIN_EMAIL)가 처음 로그인해 계정이 만들어질 때 바로 ADMIN 권한을 준다.
    // 계정 생성 직후 발급되는 첫 세션부터 권한이 반영되도록 가입 시점에 정한다.
    // id는 DB가 만들므로 넘겨받은 값(빈 값)은 버린다.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createUser: ({ id: _id, ...data }) =>
      prisma.user.create({
        data: { ...data, role: resolveRoleByEmail(data.email, process.env.ADMIN_EMAIL) },
      }),
  },
  ...authConfig,
})
