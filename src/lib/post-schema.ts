import { z } from 'zod'

// URL에 쓰는 식별자. 글자(한글 포함) 숫자를 하이픈으로 이은 형태만 허용하고 소문자로 정규화한다.
export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(100)
  .regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u)

export const postStatusSchema = z.enum(['IN_PROGRESS', 'COMPLETED'])

export const createPostSchema = z.object({
  // 진행 상태. 생략하면 DB 기본값(COMPLETED)을 따른다.
  status: postStatusSchema.optional(),
  // 직접 지정할 slug. 생략하면 서버가 제목으로 생성한다. 이미 있는 slug면 409를 반환한다.
  slug: slugSchema.optional(),
  // 서브메뉴(카테고리) 지정. 글 종류와 같은 type의 카테고리여야 한다.
  categoryId: z.uuid().optional(),
  title: z.string().trim().min(1),
  content: z.string(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean(),
  // 본문에 삽입된 이미지/동영상 URL 목록. ImageKit 업로드(/api/media/upload-auth 인증)로 받은 URL을 그대로 전달한다.
  mediaUrls: z.array(z.url()).optional(),
})

export const updatePostSchema = z.object({
  status: postStatusSchema.optional(),
  // 서브메뉴(카테고리) 변경. null은 미분류로 되돌린다.
  categoryId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  thumbnailUrl: z.url().nullable().optional(),
  metaTitle: z.string().trim().nullable().optional(),
  metaDescription: z.string().trim().nullable().optional(),
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
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type UpdateDevLogInput = z.infer<typeof updateDevLogSchema>
