import { z } from 'zod'

/**
 * Post 생성/수정 API의 zod 스키마를 한 곳에 모아 프론트-백엔드가 z.infer로 타입을 공유한다.
 * 서버(route.ts)는 safeParse에, 프론트(훅/폼)는 z.infer<typeof ...>로 타입만 가져다 쓴다.
 */

// URL에 쓰는 식별자. 글자(한글 포함)·숫자를 하이픈으로 이은 형태만 허용하고 소문자로 정규화한다.
export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(100)
  .regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u)

export const createProjectSchema = z.object({
  // 직접 지정할 slug. 생략하면 서버가 제목으로 생성한다. 이미 있는 slug면 409를 반환한다.
  slug: slugSchema.optional(),
  // 서브메뉴(카테고리) 지정. 글 종류와 같은 type의 카테고리여야 한다.
  categoryId: z.string().uuid().optional(),
  title: z.string().trim().min(1),
  content: z.string(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean(),
  // 본문에 삽입된 이미지/동영상 URL 목록. ImageKit 업로드(/api/media/upload-auth 인증)로 받은 URL을 그대로 전달한다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export const updateProjectSchema = z.object({
  // 서브메뉴(카테고리) 변경. null은 미분류로 되돌린다.
  categoryId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean().optional(),
  // 본문 media 목록 전체 교체. 생략하면 기존 Media를 건드리지 않는다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export const updateDevLogSchema = z.object({
  // 서브메뉴(카테고리) 변경. null은 미분류로 되돌린다.
  categoryId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean().optional(),
  // 본문 media 목록 전체 교체. 생략하면 기존 Media를 건드리지 않는다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export const updateLabSchema = z.object({
  // 서브메뉴(카테고리) 변경. null은 미분류로 되돌린다.
  categoryId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean().optional(),
  // 본문 media 목록 전체 교체. 생략하면 기존 Media를 건드리지 않는다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export const postTypeSchema = z.enum(['PROJECT', 'LAB', 'DEV_LOG'])

export const createCategorySchema = z.object({
  type: postTypeSchema,
  name: z.string().trim().min(1).max(30),
  order: z.number().int().min(0).optional(),
})

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(30).optional(),
  order: z.number().int().min(0).optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type UpdateDevLogInput = z.infer<typeof updateDevLogSchema>
export type UpdateLabInput = z.infer<typeof updateLabSchema>
