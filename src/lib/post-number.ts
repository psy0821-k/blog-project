import type { Prisma } from '@/generated/prisma/client'

const DEV_LOG_NUMBER_LOCK_KEY = 650001

export async function getNextDevLogNumber(tx: Prisma.TransactionClient): Promise<number> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${DEV_LOG_NUMBER_LOCK_KEY})`

  const { _max } = await tx.post.aggregate({
    where: { type: 'DEV_LOG' },
    _max: { devNumber: true },
  })

  return (_max.devNumber ?? 0) + 1
}
