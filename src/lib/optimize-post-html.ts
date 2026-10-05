import sanitizeHtml from 'sanitize-html'
import { buildResizedImageUrl } from './imagekit-url'

// sanitizePostHtml을 거친 HTML에만 쓴다. 허용 목록을 두지 않으므로 이 함수 자체는 보안 필터가 아니다.

/** srcset 후보 너비. 가장 큰 값은 데스크탑 콘텐츠 최대 너비(1320)를 2x 화면까지 감당하는 상한이다. */
const SRCSET_WIDTHS = [480, 768, 1200, 1920]
const FALLBACK_SRC_WIDTH = 1200

// globals.css의 .img-sm/md/lg 폭(모바일/태블릿 768~/데스크탑 1440~)과 맞춘 sizes. 프리셋 폭을 바꾸면 함께 고친다.
const SIZES_BY_PRESET: Record<string, string> = {
  'img-sm': '(min-width: 1440px) 360px, (min-width: 768px) 308px, 60vw',
  'img-md': '(min-width: 1440px) 600px, (min-width: 768px) 538px, 100vw',
  'img-lg': '(min-width: 1440px) 1200px, (min-width: 768px) 768px, 100vw',
}
const DEFAULT_PRESET = 'img-md'

function findPreset(className: string | undefined): string {
  const classes = className?.split(/\s+/) ?? []

  return classes.find((name) => name in SIZES_BY_PRESET) ?? DEFAULT_PRESET
}

function addResponsiveAttributes(tagName: string, attribs: sanitizeHtml.Attributes) {
  const { src } = attribs

  // 변환 대상(ImageKit 주소)이 아니면 속성을 건드리지 않는다.
  if (!src || buildResizedImageUrl(src, FALLBACK_SRC_WIDTH) === src) {
    return { tagName, attribs }
  }

  const srcset = SRCSET_WIDTHS.map((width) => `${buildResizedImageUrl(src, width)} ${width}w`).join(', ')

  return {
    tagName,
    attribs: {
      ...attribs,
      src: buildResizedImageUrl(src, FALLBACK_SRC_WIDTH),
      srcset,
      sizes: SIZES_BY_PRESET[findPreset(attribs.class)],
    },
  }
}

/** 본문 이미지에 ImageKit 너비 변환 srcset/sizes를 붙인다. 원본 HTML(DB 저장값)은 바꾸지 않는다. */
export function optimizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: false,
    allowedAttributes: false,
    // 이미 sanitizePostHtml을 거친 입력만 받으므로 script/style이 들어올 수 없다. 경고만 끈다.
    allowVulnerableTags: true,
    transformTags: { img: addResponsiveAttributes },
  })
}
