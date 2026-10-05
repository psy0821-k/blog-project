import { Quill } from 'react-quill-new'
import { BlockEmbed } from 'quill/blots/block'

/** 영상 임베드 값. label은 스크린리더용 설명이며 없으면 장식 영상으로 취급한다. */
export interface UploadedVideoValue {
  url: string
  label: string | null
}

/**
 * ImageKit에 업로드한 영상을 <video controls>로 삽입하는 커스텀 블롯.
 * Quill 기본 video 블롯은 iframe이라 mp4/webm 파일 재생에 맞지 않아 YouTube 임베드(video)와 구분한다.
 */
class UploadedVideoBlot extends BlockEmbed {
  static blotName = 'uploadedVideo'
  static tagName = 'video'

  static create(value: UploadedVideoValue | string) {
    const { url, label } = typeof value === 'string' ? { url: value, label: null } : value
    const node = super.create(url) as HTMLVideoElement

    node.setAttribute('src', url)
    node.setAttribute('controls', 'true')
    node.setAttribute('preload', 'metadata')

    if (label) {
      node.setAttribute('aria-label', label)
    } else {
      node.setAttribute('aria-hidden', 'true')
    }

    return node
  }

  static value(node: HTMLElement): UploadedVideoValue {
    return {
      url: node.getAttribute('src') ?? '',
      label: node.getAttribute('aria-label'),
    }
  }
}

Quill.register(UploadedVideoBlot)

export const UPLOADED_VIDEO_BLOT_NAME = UploadedVideoBlot.blotName
