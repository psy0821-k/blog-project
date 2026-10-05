'use client'

import { useState } from 'react'
import RichTextEditor from '@/components/features/rich-text-editor/RichTextEditor'

// TODO: 에디터 동작 확인용 임시 페이지. 글쓰기 폼에 연결한 뒤 이 폴더째 삭제한다.
export default function EditorTestPage() {
  const [html, setHtml] = useState('')

  return (
    <main className="content py-10">
      <h1 className="text-2xl font-bold">에디터 테스트</h1>
      <p className="mt-1 text-sm text-gray-500">
        이미지/영상 버튼은 ImageKit에 업로드하고, YT 버튼은 YouTube 주소만 받습니다.
      </p>

      <div className="mt-6">
        <RichTextEditor value={html} onChange={setHtml} placeholder="내용을 입력하세요" />
      </div>

      <h2 className="mt-8 font-semibold">저장될 HTML</h2>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-50 p-4 text-xs whitespace-pre-wrap">
        {html || '(비어 있음)'}
      </pre>
    </main>
  )
}
