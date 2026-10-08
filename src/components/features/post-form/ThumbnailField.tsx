'use client'

import { useState, type ChangeEvent } from 'react'
import Image from 'next/image'

import { useMediaUpload, type UploadedMedia } from '@/hooks/use-media-upload'
import { MAX_THUMBNAIL_VIDEO_SIZE_BYTES, isVideoUrl } from '@/lib/media-validation'

// 수정 화면에서 불러온 기존 썸네일은 fileId를 모르므로(DB에 URL만 저장) 선택값으로 둔다.
export interface ThumbnailValue {
  url: string
  fileId?: string
}

interface ThumbnailFieldProps {
  value: ThumbnailValue | null
  onChange: (thumbnail: UploadedMedia | null) => void
}

const ACCEPTED_THUMBNAIL_TYPES = 'image/jpeg,image/png,image/webp,video/mp4,video/webm'
const MAX_THUMBNAIL_VIDEO_MB = MAX_THUMBNAIL_VIDEO_SIZE_BYTES / 1024 / 1024

// 썸네일 선택 미리보기. 교체하거나 지우면 이전에 올린 파일은 ImageKit에서도 삭제한다.
const ThumbnailField = ({ value, onChange }: ThumbnailFieldProps) => {
  const { uploadFile, deleteFile, isUploading, error } = useMediaUpload()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const removePrevious = async () => {
    setDeleteError(null)

    // 파일 ID가 없는 기존 썸네일은 ImageKit에서 지울 수 없어 그대로 둔다.
    if (!value?.fileId) return

    try {
      await deleteFile(value.fileId)
    } catch {
      setDeleteError('이전 파일을 삭제하지 못했습니다.')
    }
  }

  const handleSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const uploaded = await uploadFile(file, 'thumbnail')

      await removePrevious()
      onChange(uploaded)
    } catch {
      // 업로드 실패 시 기존 썸네일은 유지
    }
  }

  const handleRemove = async () => {
    await removePrevious()
    onChange(null)
  }

  const message = error ?? deleteError

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="post-thumbnail" className="text-sm font-semibold">
        썸네일
      </label>

      {value && (
        <div className="aspect-video w-full max-w-xs bg-black">
          {isVideoUrl(value.url) ? (
            <video
              src={value.url}
              aria-label="선택한 썸네일 영상 미리보기"
              controls
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              src={value.url}
              alt="선택한 썸네일 미리보기"
              width={300}
              height={200}
              className="h-full w-full object-contain"
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          id="post-thumbnail"
          type="file"
          accept={ACCEPTED_THUMBNAIL_TYPES}
          disabled={isUploading}
          onChange={handleSelect}
          className="text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          >
            제거
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        이미지(5MB 이하) 또는 짧은 영상(mp4/webm, {MAX_THUMBNAIL_VIDEO_MB}MB 이하)을 올릴 수
        있습니다.
      </p>
      {isUploading && <p className="text-xs text-gray-500">업로드 중...</p>}
      {message && (
        <p role="alert" className="text-xs text-red-600">
          {message}
        </p>
      )}
    </div>
  )
}

export default ThumbnailField
