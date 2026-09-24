import { auth } from '@/auth'

/**
 * 요청자가 ADMIN 권한을 가진 세션인지 확인한다.
 * ADMIN이 아니면 null을 반환하므로, 호출부에서 null이면 forbiddenResponse()를 반환한다.
 */
export async function requireAdminSession() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return session
}
