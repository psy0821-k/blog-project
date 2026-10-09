'use client'

import { useState, type KeyboardEvent } from 'react'

import { toTagSlug } from '@/lib/tag'

interface TagInputFieldProps {
  value: string[]
  onChange: (tags: string[]) => void
}

const MAX_TAG_COUNT = 20

// Enter 또는 쉼표로 태그를 추가하고, 칩의 ×로 삭제한다. slug가 같은 태그는 한 번만 담는다.
const TagInputField = ({ value, onChange }: TagInputFieldProps) => {
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const name = draft.trim()
    const isDuplicated = value.some((tag) => toTagSlug(tag) === toTagSlug(name))

    if (name && !isDuplicated && value.length < MAX_TAG_COUNT) {
      onChange([...value, name])
    }

    setDraft('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 글자 확정이므로 태그로 추가하지 않는다.
    if (event.nativeEvent.isComposing) return

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="post-tags" className="text-sm font-semibold">
        사용한 기술{' '}
        <span className="font-normal text-gray-500">(Enter 또는 쉼표로 추가)</span>
      </label>
      <input
        id="post-tags"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="예: Next.js"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
      />
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs"
            >
              {tag}
              <button
                type="button"
                aria-label={`${tag} 태그 삭제`}
                onClick={() => onChange(value.filter((item) => item !== tag))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagInputField
