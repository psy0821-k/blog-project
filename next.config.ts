import type { NextConfig } from 'next'

// 이미지는 내 ImageKit 계정 경로(/<ID>/**)만 최적화 대상으로 허용한다.
// 호스트만 허용하면 다른 ImageKit 계정의 이미지까지 이 서버가 대신 처리하게 된다.
const imagekitId = process.env.IMAGEKIT_ID

if (!imagekitId && process.env.NODE_ENV === 'production') {
  throw new Error('IMAGEKIT_ID 환경 변수가 설정되어 있지 않습니다. (ik.imagekit.io/<ID>/ 의 ID)')
}

const isDev = process.env.NODE_ENV !== 'production'

// CSP는 화면이 깨지지 않도록 먼저 Report-Only로 적용한다. 위반 내용을 확인한 뒤 강제로 바꾼다.
const REPORT_ONLY_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://ik.imagekit.io",
  "media-src 'self' blob: https://ik.imagekit.io",
  "font-src 'self' data:",
  "connect-src 'self' https://upload.imagekit.io https://ik.imagekit.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // 다른 사이트가 이 사이트를 iframe에 넣지 못하게 한다. 이 지시어만 먼저 강제한다.
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'Content-Security-Policy-Report-Only', value: REPORT_ONLY_CSP },
  ...(isDev
    ? []
    : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]),
]

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 썸네일 등 ImageKit에 업로드한 이미지를 next/image로 표시하기 위해 허용한다.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        ...(imagekitId ? { pathname: `/${imagekitId}/**` } : {}),
      },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default nextConfig
