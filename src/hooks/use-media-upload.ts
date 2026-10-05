import { upload } from '@imagekit/next'
import { useCallback, useState } from 'react'
import { validateMediaFile } from '@/lib/media-validation'

const UPLOAD_AUTH_URL = '/api/media/upload-auth'
const MEDIA_API_URL = '/api/media'
const UPLOAD_FOLDER = '/posts'

interface UploadAuthResponse {
  token: string
  signature: string
  expire: number
  publicKey: string
}

export interface UploadedMedia {
  url: string
  fileId: string
}

interface UseMediaUploadResult {
  uploadFile: (file: File) => Promise<UploadedMedia>
  deleteFile: (fileId: string) => Promise<void>
  isUploading: boolean
  error: string | null
}

async function fetchUploadAuth(): Promise<UploadAuthResponse> {
  const response = await fetch(UPLOAD_AUTH_URL)

  if (!response.ok) {
    throw new Error('업로드 인증에 실패했습니다.')
  }

  return (await response.json()) as UploadAuthResponse
}

/**
 * 이미지/동영상 파일을 ImageKit에 브라우저에서 직접 업로드한다.
 * 서버는 인증 파라미터 발급(/api/media/upload-auth)만 담당하고, 실제 파일 전송은 서버를 거치지 않는다
 * (Vercel Functions의 요청 본문 4.5MB 제한을 피하기 위함 — 동영상 업로드에 필수).
 */
export function useMediaUpload(): UseMediaUploadResult {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (file: File): Promise<UploadedMedia> => {
    setError(null)

    const validationError = validateMediaFile(file)

    if (validationError) {
      setError(validationError)
      throw new Error(validationError)
    }

    setIsUploading(true)

    try {
      const { token, signature, expire, publicKey } = await fetchUploadAuth()

      const result = await upload({
        file,
        fileName: file.name,
        publicKey,
        token,
        signature,
        expire,
        folder: UPLOAD_FOLDER,
        useUniqueFileName: true,
      })

      if (!result.url || !result.fileId) {
        throw new Error('업로드 결과에 URL 또는 fileId가 없습니다.')
      }

      return { url: result.url, fileId: result.fileId }
    } catch (err) {
      const message = err instanceof Error ? err.message : '파일 업로드에 실패했습니다.'
      setError(message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [])

  /** 업로드한 파일을 ImageKit에서 삭제한다(업로드 취소용). */
  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    setError(null)

    const response = await fetch(`${MEDIA_API_URL}/${fileId}`, { method: 'DELETE' })

    if (!response.ok && response.status !== 404) {
      const message = '파일 삭제에 실패했습니다.'
      setError(message)
      throw new Error(message)
    }
  }, [])

  return { uploadFile, deleteFile, isUploading, error }
}
