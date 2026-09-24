import { z } from 'zod'

/**
 * Post 생성/수정 API의 zod 스키마를 한 곳에 모아 프론트-백엔드가 z.infer로 타입을 공유한다.
 * 서버(route.ts)는 safeParse에, 프론트(훅/폼)는 z.infer<typeof ...>로 타입만 가져다 쓴다.
 */

export const createProjectSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean(),
  // 본문에 삽입된 이미지/동영상 URL 목록. 업로드(/api/media/upload)로 받은 blob URL을 그대로 전달한다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export const updateProjectSchema = z.object({
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
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean().optional(),
  // 본문 media 목록 전체 교체. 생략하면 기존 Media를 건드리지 않는다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export const updateLabSchema = z.object({
  title: z.string().trim().min(1).optional(),
  content: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  published: z.boolean().optional(),
  // 본문 media 목록 전체 교체. 생략하면 기존 Media를 건드리지 않는다.
  mediaUrls: z.array(z.string().url()).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type UpdateDevLogInput = z.infer<typeof updateDevLogSchema>
export type UpdateLabInput = z.infer<typeof updateLabSchema>
