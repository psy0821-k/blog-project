import type { Quill } from 'react-quill-new'
import { askImageSize, getAnchorOfElement } from './editor-prompts'
import { UPLOADED_VIDEO_BLOT_NAME, type UploadedVideoValue } from './uploaded-video-blot'

export type InsertMedia = (quill: Quill, index: number, url: string, description: string | null) => void

/** 파일 선택창을 열고 선택한 파일을 돌려준다. 취소하면 null. */
export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.hidden = true

    const finish = (file: File | null) => {
      input.remove()
      resolve(file)
    }

    input.onchange = () => finish(input.files?.[0] ?? null)
    input.oncancel = () => finish(null)

    // DOM에 붙이지 않은 input은 일부 브라우저에서 선택 이벤트가 유실될 수 있어 잠시 붙여둔다.
    document.body.appendChild(input)
    input.click()
  })
}

/** 이미지가 로드돼 높이가 정해질 때까지 기다린다. 로드 실패도 기다림을 끝낸다. */
function waitForImageLoad(image: HTMLImageElement): Promise<void> {
  if (image.complete) return Promise.resolve()

  return new Promise((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true })
    image.addEventListener('error', () => resolve(), { once: true })
  })
}

/** 이미지 하단 버튼으로 크기를 고르면 적용한다. 선택 중 문서가 바뀔 수 있어 위치는 적용 시점에 구한다. */
async function chooseImageSize(quill: Quill, image: HTMLImageElement) {
  // 로드 전에 위치를 잡으면 이미지가 커진 뒤 패널이 이미지와 겹친다.
  await waitForImageLoad(image)

  const size = await askImageSize(getAnchorOfElement(image))
  if (!size) return

  const blot = quill.scroll.find(image)
  if (!blot) return

  quill.formatText(quill.getIndex(blot), 1, 'size', size, 'user')
}

/**
 * index에 삽입한 이미지의 DOM을 찾는다.
 * 텍스트와 이미지 경계에서는 getLeaf(index)가 앞쪽 텍스트를 돌려주므로 이미지가 끝나는 index + 1도 확인한다.
 */
function findImageAt(quill: Quill, index: number): HTMLImageElement | null {
  for (const position of [index, index + 1]) {
    const [leaf] = quill.getLeaf(position)
    if (leaf?.domNode instanceof HTMLImageElement) return leaf.domNode
  }

  return null
}

export const insertImage: InsertMedia = (quill, index, url, description) => {
  quill.insertEmbed(index, 'image', url, 'user')
  // 이미지 블롯은 alt/size를 포맷으로 받는다. alt가 null이면 블롯 기본값(alt="" + aria-hidden)이 유지된다.
  if (description) quill.formatText(index, 1, 'alt', description, 'user')

  // 기본 크기로 먼저 삽입하고, 하단 버튼으로 바꿀 수 있게 한다.
  const image = findImageAt(quill, index)
  if (image) void chooseImageSize(quill, image)
}

export const insertVideo: InsertMedia = (quill, index, url, description) => {
  const value: UploadedVideoValue = { url, label: description }
  quill.insertEmbed(index, UPLOADED_VIDEO_BLOT_NAME, value, 'user')
}

/** 에디터 안의 이미지를 클릭하면 크기를 다시 정할 수 있게 한다. 해제 함수를 반환한다. */
export function bindImageResize(quill: Quill): () => void {
  const handleClick = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLImageElement)) return

    void chooseImageSize(quill, event.target)
  }

  quill.root.addEventListener('click', handleClick)

  return () => quill.root.removeEventListener('click', handleClick)
}
