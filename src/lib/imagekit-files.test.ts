import { describe, expect, it } from 'vitest'

import { extractImageKitFilePath } from './imagekit-files'

describe('extractImageKitFilePath', () => {
  it('ImageKit ID를 제외한 파일 경로를 반환한다', () => {
    expect(extractImageKitFilePath('https://ik.imagekit.io/myid/posts/photo_abc.jpg')).toBe(
      '/posts/photo_abc.jpg',
    )
  })

  it('쿼리스트링은 무시한다', () => {
    expect(extractImageKitFilePath('https://ik.imagekit.io/myid/posts/photo.jpg?updatedAt=1')).toBe(
      '/posts/photo.jpg',
    )
  })

  it('tr: 변환 조각은 파일 경로에서 제외한다', () => {
    expect(extractImageKitFilePath('https://ik.imagekit.io/myid/tr:w-800/posts/photo.jpg')).toBe(
      '/posts/photo.jpg',
    )
  })

  it('퍼센트 인코딩된 경로는 디코딩한다', () => {
    expect(extractImageKitFilePath('https://ik.imagekit.io/myid/posts/%ED%8C%8C%EC%9D%BC.png')).toBe(
      '/posts/파일.png',
    )
  })

  it('ImageKit 주소가 아니면 null을 반환한다', () => {
    expect(extractImageKitFilePath('https://example.com/myid/posts/photo.jpg')).toBeNull()
  })

  it('파일 경로가 없으면 null을 반환한다', () => {
    expect(extractImageKitFilePath('https://ik.imagekit.io/myid')).toBeNull()
    expect(extractImageKitFilePath('https://ik.imagekit.io/myid/tr:w-800')).toBeNull()
  })

  it('URL 형식이 아니면 null을 반환한다', () => {
    expect(extractImageKitFilePath('not a url')).toBeNull()
  })
})
