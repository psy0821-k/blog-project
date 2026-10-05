import type { Quill } from 'react-quill-new'
import { IMAGE_GAPS, type ImageGap } from './image-gap-format'
import { IMAGE_SIZES, type ImageSize } from './lazy-image-blot'

const IMAGE_SIZE_LABELS: Record<ImageSize, string> = { sm: '소', md: '중', lg: '대' }
const IMAGE_GAP_LABELS: Record<ImageGap, string> = { sm: '좁게', md: '보통', lg: '넓게' }

/** 이미지 줄 간격 선택 결과. gap이 null이면 가로 나열 해제, 전체가 null이면 취소. */
export type ImageGapChoice = { gap: ImageGap | null } | null

/** 패널을 띄울 기준 위치. 뷰포트 좌표이며 패널은 이 점 아래에 열린다. */
export interface PanelAnchor {
  left: number
  bottom: number
}

type Done<T> = (value: T | null) => void

const PANEL_CLASS =
  'absolute z-50 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg'
const BUTTON_CLASS =
  'rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 focus-visible:outline-2'
const PRIMARY_BUTTON_CLASS =
  'rounded-md bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-700 focus-visible:outline-2'
const INPUT_CLASS = 'w-64 rounded-md border border-gray-200 px-2 py-1 text-sm outline-none'
const PANEL_OFFSET = 8

let closeActivePanel: (() => void) | null = null

/** 에디터 안 특정 위치(index) 하단을 기준으로 삼는다. */
export function getAnchorAtIndex(quill: Quill, index: number): PanelAnchor {
  const bounds = quill.getBounds(index)
  const container = quill.container.getBoundingClientRect()

  return { left: container.left + (bounds?.left ?? 0), bottom: container.top + (bounds?.bottom ?? 0) }
}

/** 요소 하단을 기준으로 삼는다. */
export function getAnchorOfElement(element: Element): PanelAnchor {
  const rect = element.getBoundingClientRect()

  return { left: rect.left, bottom: rect.bottom }
}

function createButton(label: string, className: string, onClick: () => void) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = className
  button.textContent = label
  // 버튼을 눌러도 에디터의 포커스와 선택 영역이 유지되도록 한다.
  button.addEventListener('mousedown', (event) => event.preventDefault())
  button.addEventListener('click', onClick)

  return button
}

/**
 * 기준 위치 하단에 패널을 띄우고 done으로 넘긴 값을 돌려준다.
 * 바깥 클릭이나 Esc는 null. 패널은 한 번에 하나만 열린다.
 */
function openPanel<T>(
  anchor: PanelAnchor,
  label: string,
  render: (panel: HTMLElement, done: Done<T>) => void,
): Promise<T | null> {
  closeActivePanel?.()

  return new Promise((resolve) => {
    const panel = document.createElement('div')
    panel.className = PANEL_CLASS
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-label', label)
    panel.style.top = `${anchor.bottom + window.scrollY + PANEL_OFFSET}px`
    panel.style.left = `${anchor.left + window.scrollX}px`

    let closed = false

    function close(value: T | null) {
      if (closed) return
      closed = true

      document.removeEventListener('pointerdown', handleOutsidePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
      panel.remove()
      closeActivePanel = null
      resolve(value)
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && panel.contains(event.target)) return
      close(null)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close(null)
    }

    render(panel, close)

    document.body.appendChild(panel)
    document.addEventListener('pointerdown', handleOutsidePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    closeActivePanel = () => close(null)
  })
}

interface Choice<T> {
  label: string
  value: T
}

function askChoice<T>(anchor: PanelAnchor, label: string, choices: Choice<T>[]) {
  return openPanel<T>(anchor, label, (panel, done) => {
    choices.forEach((choice) => {
      panel.appendChild(createButton(choice.label, BUTTON_CLASS, () => done(choice.value)))
    })
  })
}

interface AskTextOptions {
  label: string
  placeholder?: string
}

/** 한 줄 입력 패널. 확인(Enter)하면 입력값(앞뒤 공백 제거), 바깥 클릭이나 Esc면 null. 빈 입력은 빈 문자열. */
export function askText(anchor: PanelAnchor, { label, placeholder }: AskTextOptions) {
  return openPanel<string>(anchor, label, (panel, done) => {
    const input = document.createElement('input')
    input.type = 'text'
    input.className = INPUT_CLASS
    input.placeholder = placeholder ?? ''
    input.setAttribute('aria-label', label)

    const submit = () => done(input.value.trim())

    input.addEventListener('keydown', (event) => {
      // 한글 조합 중 Enter는 글자 확정이므로 제출하지 않는다.
      if (event.key === 'Enter' && !event.isComposing) submit()
    })

    panel.appendChild(input)
    panel.appendChild(createButton('확인', PRIMARY_BUTTON_CLASS, submit))

    // 패널이 DOM에 붙은 뒤에 포커스를 줘야 한다.
    queueMicrotask(() => input.focus())
  })
}

/** 업로드된 링크를 보여주며 대체 텍스트를 받는다. 비우거나 닫으면 null(장식 처리). */
export async function askDescription(anchor: PanelAnchor, url: string): Promise<string | null> {
  const input = await askText(anchor, {
    label: `대체 텍스트 (업로드된 링크: ${url})`,
    placeholder: '대체 텍스트 (비워두면 장식용)',
  })

  return input || null
}

/** 이미지 크기(소/중/대)를 고른다. 닫으면 null. */
export function askImageSize(anchor: PanelAnchor) {
  return askChoice<ImageSize>(
    anchor,
    '이미지 크기',
    IMAGE_SIZES.map((size) => ({ label: IMAGE_SIZE_LABELS[size], value: size })),
  )
}

/** 이미지 줄 간격(좁게/보통/넓게/해제)을 고른다. 해제는 gap: null, 닫으면 null. */
export function askImageGap(anchor: PanelAnchor): Promise<ImageGapChoice> {
  const choices: Choice<NonNullable<ImageGapChoice>>[] = [
    ...IMAGE_GAPS.map((gap) => ({ label: IMAGE_GAP_LABELS[gap], value: { gap } })),
    { label: '나열 해제', value: { gap: null } },
  ]

  return askChoice(anchor, '이미지 가로 나열 간격', choices)
}
