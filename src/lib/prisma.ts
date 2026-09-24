import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '@/generated/prisma/client'

// Next.js 개발 모드에서 파일이 변경될 때마다 모듈이 재로드되면서
// PrismaClient 인스턴스가 계속 새로 생성되는 것을 막기 위한 싱글턴 패턴
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * update/delete 대상 레코드가 이미 없을 때 Prisma가 던지는 P2025 에러인지 확인한다.
 * findUnique로 존재를 확인한 뒤 update/delete하는 check-then-act 패턴은
 * 동시 요청 시 그 사이에 레코드가 삭제될 수 있어(레이스 컨디션), 이 에러를 별도로 처리해야 한다.
 */
export function isRecordNotFoundError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}
