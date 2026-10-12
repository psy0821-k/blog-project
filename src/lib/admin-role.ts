import type { Role } from '@/generated/prisma/client'

export const resolveRoleByEmail = (email: string, adminEmail: string | undefined): Role => {
  if (!adminEmail) return 'USER'

  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase() ? 'ADMIN' : 'USER'
}
