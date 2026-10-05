import sanitizeHtml from 'sanitize-html'

// 서버/브라우저 어디서든 쓰는 순수 함수. 글 본문(HTML)을 렌더링하기 직전에 1회 호출한다.

const YOUTUBE_EMBED_HOSTNAME = 'www.youtube.com'

// 에디터(lazy-image-blot, image-gap-format)가 붙이는 클래스. 임의 클래스는 통과시키지 않는다.
const IMAGE_SIZE_CLASSES = ['img-sm', 'img-md', 'img-lg']
const IMAGE_GAP_CLASSES = ['img-gap-sm', 'img-gap-md', 'img-gap-lg']
// Quill 정렬 클래스(왼쪽 정렬은 클래스가 붙지 않는다).
const ALIGN_CLASSES = ['ql-align-center', 'ql-align-right']

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags.filter((tag) => tag !== 'iframe'),
    'h1',
    'h2',
    'h3',
    'img',
    'video',
    'iframe',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'loading', 'class', 'aria-hidden'],
    video: ['src', 'controls', 'preload', 'aria-label', 'aria-hidden'],
    iframe: ['src', 'class', 'allowfullscreen', 'frameborder'],
    p: ['class'],
    h1: ['class'],
    h2: ['class'],
    h3: ['class'],
    pre: ['class'],
    li: ['data-list', 'class'],
  },
  allowedClasses: {
    img: IMAGE_SIZE_CLASSES,
    p: [...IMAGE_GAP_CLASSES, ...ALIGN_CLASSES],
    h1: ALIGN_CLASSES,
    h2: ALIGN_CLASSES,
    h3: ALIGN_CLASSES,
    li: ALIGN_CLASSES,
    pre: ['ql-syntax'],
    iframe: ['ql-video'],
  },
  // style 속성은 허용하지 않는다. 크기/간격은 모두 클래스로 표현한다.
  allowedSchemes: ['https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https'], video: ['https'] },
  allowedIframeHostnames: [YOUTUBE_EMBED_HOSTNAME],
  allowIframeRelativeUrls: false,
  transformTags: {
    // target="_blank" 링크의 window.opener 탈취를 막는다.
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
}

/** 글 본문 HTML에서 허용되지 않은 태그/속성/주소를 제거한다. */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS)
}
