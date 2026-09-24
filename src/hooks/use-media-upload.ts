import { upload } from '@vercel/blob/client'
import { useState } from 'react'

const UPLOAD_URL = '/api/media/upload'

interface UseMediaUploadResult {
  uploadFile: (file: File) => Promise<string>
  isUploading: boolean
  error: string | null
}

/**
 * 이미지/동영상 파일을 Vercel Blob에 브라우저에서 직접 업로드한다.
 * 서버는 토큰 발급(/api/media/upload)만 담당하고, 실제 파일 전송은 서버를 거치지 않는다
 * (Vercel Functions의 요청 본문 4.5MB 제한을 피하기 위함 — 동영상 업로드에 필수).
 */
export function useMediaUpload(): UseMediaUploadResult {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadFile(file: File): Promise<string> {
    setIsUploading(true)
    setError(null)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: UPLOAD_URL,
        clientPayload: JSON.stringify({ contentType: file.type }),
      })

      return blob.url
    } catch (err) {
      const message = err instanceof Error ? err.message : '파일 업로드에 실패했습니다.'
      setError(message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, isUploading, error }
}
