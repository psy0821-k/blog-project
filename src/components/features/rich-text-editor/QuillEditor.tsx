'use client'

import 'react-quill-new/dist/quill.snow.css'
import ReactQuill from 'react-quill-new'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useMediaUpload } from '@/hooks/use-media-upload'
import EditorToolbar from './EditorToolbar'
import { bindImageResize } from './editor-media-insert'
import { createToolbarHandlers } from './editor-toolbar-handlers'
// 블롯/포맷은 import 시점에 Quill에 등록된다.
import './image-gap-format'
import './lazy-image-blot'
import './uploaded-video-blot'

export interface QuillEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
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

  const editorRef = useRef<ReactQuill>(null)

  useEffect(() => {
    const quill = editorRef.current?.getEditor()
    if (!quill) return

    return bindImageResize(quill)
  }, [])

  const errorMessage = embedError ?? uploadError

  return (
    <div className="rich-text-editor">
      <EditorToolbar id={toolbarId} />

      <ReactQuill
        className="h-100"
        ref={editorRef}
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
