import { describe, expect, it } from 'vitest'

import { isVideoUrl, validateMediaFile } from './media-validation'

const MB = 1024 * 1024

function createFile(type: string, sizeInMb: number): File {
  return new File([new Uint8Array(sizeInMb * MB)], 'sample', { type })
}

describe('validateMediaFile', () => {
  it('본문 영상은 40MB까지 허용한다', () => {
    expect(validateMediaFile(createFile('video/mp4', 30))).toBeNull()
    expect(validateMediaFile(createFile('video/mp4', 41))).not.toBeNull()
  })

  it('썸네일 영상은 10MB까지만 허용한다', () => {
    expect(validateMediaFile(createFile('video/mp4', 9), 'thumbnail')).toBeNull()
    expect(validateMediaFile(createFile('video/webm', 11), 'thumbnail')).toContain('10MB')
  })

  it('이미지는 용도와 관계없이 5MB까지 허용한다', () => {
    expect(validateMediaFile(createFile('image/png', 4), 'thumbnail')).toBeNull()
    expect(validateMediaFile(createFile('image/png', 6), 'thumbnail')).not.toBeNull()
  })

  it('지원하지 않는 형식은 거부한다', () => {
    expect(validateMediaFile(createFile('video/quicktime', 1), 'thumbnail')).not.toBeNull()
  })
})

describe('isVideoUrl', () => {
  it('확장자가 mp4/webm이면 쿼리스트링과 대소문자에 상관없이 영상으로 본다', () => {
    expect(isVideoUrl('https://ik.imagekit.io/x/posts/a.mp4')).toBe(true)
    expect(isVideoUrl('https://ik.imagekit.io/x/posts/a.WEBM?tr=w-100')).toBe(true)
  })

  it('이미지 URL은 영상이 아니다', () => {
    expect(isVideoUrl('https://ik.imagekit.io/x/posts/a.jpg')).toBe(false)
  })
})
