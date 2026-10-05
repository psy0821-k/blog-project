'use client'

import dynamic from 'next/dynamic'

// Quill은 import 시점에 document에 접근하므로 서버 렌더링에서 제외한다.
const RichTextEditor = dynamic(() => import('./QuillEditor'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-gray-100" aria-hidden />,
})

export default RichTextEditor
