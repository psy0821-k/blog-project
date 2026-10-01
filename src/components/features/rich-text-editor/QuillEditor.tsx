'use client'

import 'react-quill-new/dist/quill.snow.css'
import ReactQuill, { Quill } from 'react-quill-new'
import { useId, useMemo, useState } from 'react'
import { useMediaUpload, type UploadedMedia } from '@/hooks/use-media-upload'
import { toYouTubeEmbedUrl } from '@/lib/youtube'
import { UPLOADED_VIDEO_BLOT_NAME } from './uploaded-video-blot'

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
const VIDEO_ACCEPT = 'video/mp4,video/webm'
const YOUTUBE_EMBED_FORMAT = 'video'

export interface QuillEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

type UploadFile = (file: File) => Promise<UploadedMedia>

/** Quill은 툴바 핸들러를 this.quill이 있는 툴바 모듈 컨텍스트로 호출한다. */
interface ToolbarContext {
  quill: Quill
}

/** 파일 선택창을 열고 선택한 파일을 돌려준다. 취소하면 null. */
function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => resolve(input.files?.[0] ?? null)
    input.oncancel = () => resolve(null)
    input.click()
  })
}

/** 툴바 버튼 핸들러를 만든다. 에디터가 재생성되지 않도록 modules 안에서 한 번만 호출한다. */
function createToolbarHandlers(uploadFile: UploadFile, onError: (message: string | null) => void) {
  async function uploadAndInsert(quill: Quill, accept: string, embedFormat: string) {
    const range = quill.getSelection(true)
    const file = await pickFile(accept)
    if (!file) return

    onError(null)

    try {
      const { url } = await uploadFile(file)
      quill.insertEmbed(range.index, embedFormat, url, 'user')
      quill.setSelection(range.index + 1, 0)
    } catch {
      // 업로드 실패 메시지는 useMediaUpload의 error 상태로 표시한다.
    }
  }

  return {
    image(this: ToolbarContext) {
      return uploadAndInsert(this.quill, IMAGE_ACCEPT, 'image')
    },
    video(this: ToolbarContext) {
      return uploadAndInsert(this.quill, VIDEO_ACCEPT, UPLOADED_VIDEO_BLOT_NAME)
    },
    youtube(this: ToolbarContext) {
      const quill = this.quill
      const range = quill.getSelection(true)
      const input = window.prompt('YouTube 영상 주소를 입력하세요.')
      if (!input) return

      const embedUrl = toYouTubeEmbedUrl(input)

      if (!embedUrl) {
        onError('YouTube 주소만 삽입할 수 있습니다.')
        return
      }

      onError(null)
      quill.insertEmbed(range.index, YOUTUBE_EMBED_FORMAT, embedUrl, 'user')
      quill.setSelection(range.index + 1, 0)
    },
  }
}

const QuillEditor = ({ value, onChange, placeholder }: QuillEditorProps) => {
  // useId는 ':'를 포함해 CSS 선택자로 쓸 수 없으므로 제거한다.
  const toolbarId = `editor-toolbar-${useId().replace(/:/g, '')}`
  const { uploadFile, isUploading, error: uploadError } = useMediaUpload()
  const [embedError, setEmbedError] = useState<string | null>(null)

  // modules 객체가 바뀌면 Quill이 에디터를 다시 만들어 내용과 포커스를 잃으므로 안정된 참조를 유지한다.
  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${toolbarId}`,
        handlers: createToolbarHandlers(uploadFile, setEmbedError),
      },
    }),
    [toolbarId, uploadFile],
  )

  const errorMessage = embedError ?? uploadError

  return (
    <div className="rich-text-editor">
      <div id={toolbarId}>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="" aria-label="제목 크기">
            <option value="1">제목 1</option>
            <option value="2">제목 2</option>
            <option value="3">제목 3</option>
            <option value="">본문</option>
          </select>
        </span>
        <span className="ql-formats">
          <button type="button" className="ql-bold" aria-label="굵게" />
          <button type="button" className="ql-italic" aria-label="기울임" />
          <button type="button" className="ql-underline" aria-label="밑줄" />
        </span>
        <span className="ql-formats">
          <button type="button" className="ql-list" value="ordered" aria-label="번호 목록" />
          <button type="button" className="ql-list" value="bullet" aria-label="글머리 목록" />
          <button type="button" className="ql-blockquote" aria-label="인용" />
          <button type="button" className="ql-code-block" aria-label="코드 블록" />
        </span>
        <span className="ql-formats">
          <button type="button" className="ql-link" aria-label="링크" />
          <button type="button" className="ql-image" aria-label="이미지 업로드" />
          <button type="button" className="ql-video" aria-label="영상 업로드" />
          <button type="button" className="ql-youtube" aria-label="YouTube 영상 삽입">
            YT
          </button>
        </span>
      </div>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />

      {isUploading && <p className="mt-2 text-sm text-gray-500">업로드 중...</p>}
      {errorMessage && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default QuillEditor
