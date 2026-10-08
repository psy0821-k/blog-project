'use client'

import { useState, type ChangeEvent } from 'react'
import Image from 'next/image'

import { useMediaUpload, type UploadedMedia } from '@/hooks/use-media-upload'

interface ThumbnailFieldProps {
  value: UploadedMedia | null
  onChange: (thumbnail: UploadedMedia | null) => void
}

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp'

// 썸네일 선택·미리보기. 교체하거나 지우면 이전에 올린 파일은 ImageKit에서도 삭제한다.
const ThumbnailField = ({ value, onChange }: ThumbnailFieldProps) => {
  const { uploadFile, deleteFile, isUploading, error } = useMediaUpload()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const removePrevious = async () => {
    setDeleteError(null)

    if (!value) return

    try {
      await deleteFile(value.fileId)
    } catch {
      setDeleteError('이전 이미지를 삭제하지 못했습니다.')
    }
  }

  const handleSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const uploaded = await uploadFile(file)

      await removePrevious()
      onChange(uploaded)
    } catch {
      // 업로드 실패 메시지는 useMediaUpload의 error로 표시되고, 기존 썸네일은 유지된다.
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
          <Image
            src={value.url}
            alt="선택한 썸네일 미리보기"
            width={300}
            height={200}
            className="h-full w-full object-contain"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          id="post-thumbnail"
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
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
