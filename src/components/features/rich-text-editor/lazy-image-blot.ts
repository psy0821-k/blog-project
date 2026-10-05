import { Quill } from 'react-quill-new'
import Image from 'quill/formats/image'

/** 이미지 크기 프리셋. 실제 폭은 globals.css의 .img-{size}가 화면 크기별로 정한다. */
export const IMAGE_SIZES = ['sm', 'md', 'lg'] as const
export type ImageSize = (typeof IMAGE_SIZES)[number]

export const DEFAULT_IMAGE_SIZE: ImageSize = 'md'

const IMAGE_SIZE_CLASS_PREFIX = 'img-'

export function isImageSize(value: unknown): value is ImageSize {
  return IMAGE_SIZES.some((size) => size === value)
}

/** 대체 텍스트가 없으면 장식 이미지로 취급해 alt=""와 aria-hidden을 함께 둔다. */
function applyAlt(node: HTMLElement, alt: string | null | undefined) {
  if (alt) {
    node.setAttribute('alt', alt)
    node.removeAttribute('aria-hidden')
    return
  }

  node.setAttribute('alt', '')
  node.setAttribute('aria-hidden', 'true')
}

/** 기존 크기 클래스를 지우고 프리셋 클래스 하나만 붙인다. */
function applySize(node: HTMLElement, size: ImageSize) {
  IMAGE_SIZES.forEach((item) => node.classList.remove(`${IMAGE_SIZE_CLASS_PREFIX}${item}`))
  node.classList.add(`${IMAGE_SIZE_CLASS_PREFIX}${size}`)
}

function readSize(node: Element): ImageSize | null {
  return IMAGE_SIZES.find((size) => node.classList.contains(`${IMAGE_SIZE_CLASS_PREFIX}${size}`)) ?? null
}

/**
 * 에디터에서 삽입하는 이미지에 loading="lazy", 크기 프리셋 클래스, alt(없으면 장식 처리)를 적용하는 블롯.
 * 기본 image 블롯을 같은 이름으로 덮어써 툴바/붙여넣기/HTML 로드 모두에 적용한다.
 */
class LazyImageBlot extends Image {
  static create(value: string) {
    const node = super.create(value) as HTMLImageElement

    node.setAttribute('loading', 'lazy')
    applyAlt(node, null)
    applySize(node, DEFAULT_IMAGE_SIZE)

    return node
  }

  // HTML을 불러올 때 class에 담긴 크기가 포맷으로 복원되도록 size를 함께 돌려준다.
  static formats(domNode: Element) {
    const formats = super.formats(domNode)
    const size = readSize(domNode)

    return size ? { ...formats, size } : formats
  }

  format(name: string, value: string) {
    if (name === 'alt') {
      applyAlt(this.domNode, value)
      return
    }

    if (name === 'size') {
      if (isImageSize(value)) applySize(this.domNode, value)
      return
    }

    super.format(name, value)
  }
}

Quill.register(LazyImageBlot, true)
