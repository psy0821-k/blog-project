import { Quill } from 'react-quill-new'
import { BlockEmbed } from 'quill/blots/block'

/**
 * ImageKit에 업로드한 영상을 <video controls>로 삽입하는 커스텀 블롯.
 * Quill 기본 video 블롯은 iframe이라 mp4/webm 파일 재생에 맞지 않아 YouTube 임베드(video)와 구분한다.
 */
class UploadedVideoBlot extends BlockEmbed {
  static blotName = 'uploadedVideo'
  static tagName = 'video'

  static create(url: string) {
    const node = super.create(url) as HTMLVideoElement

    node.setAttribute('src', url)
    node.setAttribute('controls', 'true')
    node.setAttribute('preload', 'metadata')

    return node
  }

  static value(node: HTMLElement) {
    return node.getAttribute('src')
  }
}

Quill.register(UploadedVideoBlot)

export const UPLOADED_VIDEO_BLOT_NAME = UploadedVideoBlot.blotName
