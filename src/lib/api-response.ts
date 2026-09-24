import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * API 에러 응답 포맷을 통일한다.
 * message는 항상 문자열, details는 zod 검증 실패처럼 필드별 상세가 있을 때만 포함한다.
 */
function errorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: { message, ...(details !== undefined && { details }) } }, { status })
}

export function forbiddenResponse() {
  return errorResponse('Forbidden', 403)
}

export function notFoundResponse(message = 'Not Found') {
  return errorResponse(message, 404)
}

export function invalidJsonResponse() {
  return errorResponse('Invalid JSON', 400)
}

export function validationErrorResponse(error: z.ZodError) {
  return errorResponse('Validation failed', 400, z.flattenError(error))
}
