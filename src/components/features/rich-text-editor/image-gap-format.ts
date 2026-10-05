import { Quill } from 'react-quill-new'
import type * as ParchmentModule from 'parchment'

/** 이미지 줄(문단) 간격 프리셋. 실제 간격은 globals.css의 .img-gap-{size}가 정한다. */
export const IMAGE_GAPS = ['sm', 'md', 'lg'] as const
export type ImageGap = (typeof IMAGE_GAPS)[number]

export const IMAGE_GAP_FORMAT_NAME = 'imageGap'

export function isImageGap(value: unknown): value is ImageGap {
  return IMAGE_GAPS.some((gap) => gap === value)
}

// Quill이 내부적으로 쓰는 parchment 인스턴스를 그대로 써야 포맷이 인식된다.
const { ClassAttributor, Scope } = Quill.import('parchment') as typeof ParchmentModule

/**
 * 문단(줄)에 img-gap-{sm|md|lg} 클래스를 붙이는 블록 포맷.
 * 클래스가 붙은 문단은 CSS에서 flex + gap이 적용돼 안에 든 이미지들이 가로로 나열된다.
 */
const imageGapAttributor = new ClassAttributor(IMAGE_GAP_FORMAT_NAME, 'img-gap', {
  scope: Scope.BLOCK,
  whitelist: [...IMAGE_GAPS],
})

Quill.register(imageGapAttributor, true)
