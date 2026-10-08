import type { Quill } from 'react-quill-new'
import type { UploadedMedia } from '@/hooks/use-media-upload'
import { toYouTubeEmbedUrl } from '@/lib/youtube'
import { askDescription, askImageGap, askText, getAnchorAtIndex } from './editor-prompts'
import { insertImage, insertVideo, pickFile, type InsertMedia } from './editor-media-insert'
import { IMAGE_GAP_FORMAT_NAME } from './image-gap-format'

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'
const VIDEO_ACCEPT = 'video/mp4,video/webm'
const YOUTUBE_EMBED_FORMAT = 'video'

type UploadFile = (file: File) => Promise<UploadedMedia>

/** Quill은 툴바 핸들러를 this.quill이 있는 툴바 모듈 컨텍스트로 호출한다. */
interface ToolbarContext {
  quill: Quill
}

/** 툴바 버튼 핸들러를 만든다. 에디터가 재생성되지 않도록 modules 안에서 한 번만 호출한다. */
export function createToolbarHandlers(
  uploadFile: UploadFile,
  onError: (message: string | null) => void,
) {
  async function uploadAndInsert(quill: Quill, accept: string, insertMedia: InsertMedia) {
    // 같은 툴바에 붙은 이전 Quill 인스턴스(StrictMode 재마운트 등)의 핸들러는 건너뛴다.
    // 먼저 파일 선택창을 열면 클릭 권한이 소진돼 살아있는 인스턴스의 선택창이 막힌다.
    if (!quill.root.isConnected) return

    const range = quill.getSelection(true)
    const file = await pickFile(accept)
    if (!file) return

    onError(null)

    try {
      const { url } = await uploadFile(file)

      const description = await askDescription(getAnchorAtIndex(quill, range.index), url)

      insertMedia(quill, range.index, url, description)
      quill.setSelection(range.index + 1, 0)
    } catch {
      // 업로드 실패 메시지는 useMediaUpload의 error 상태로 표시한다.
    }
  }

  return {
    image(this: ToolbarContext) {
      return uploadAndInsert(this.quill, IMAGE_ACCEPT, insertImage)
    },
    video(this: ToolbarContext) {
      return uploadAndInsert(this.quill, VIDEO_ACCEPT, insertVideo)
    },
    async imageGap(this: ToolbarContext) {
      const quill = this.quill
      if (!quill.root.isConnected) return

      const range = quill.getSelection(true)
      const choice = await askImageGap(getAnchorAtIndex(quill, range.index))
      if (!choice) return

      // Quill은 포맷 해제를 false로 받는다.
      quill.formatLine(
        range.index,
        range.length,
        IMAGE_GAP_FORMAT_NAME,
        choice.gap ?? false,
        'user',
      )
    },
    async youtube(this: ToolbarContext) {
      const quill = this.quill
      if (!quill.root.isConnected) return

      const range = quill.getSelection(true)
      const input = await askText(getAnchorAtIndex(quill, range.index), {
        label: 'YouTube 영상 주소',
        placeholder: 'https://www.youtube.com/watch?v=...',
      })
      if (!input) return

      const embedUrl = toYouTubeEmbedUrl(input)

      if (!embedUrl) {
        onError('YouTube 주소만 삽입할 수 있습니다.')
        return
      }

      onError(null)
      quill.insertEmbed(range.index, YOUTUBE_EMBED_FORMAT, embedUrl, 'user')
      quill.setSelection(range.index + 1, 0)
    },
  }
}
