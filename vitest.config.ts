import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // tsconfig의 "@/*" 경로 별칭과 같게 맞춘다.
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'node',
    // Playwright E2E(*.e2e.ts)는 vitest 대상이 아니다.
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
