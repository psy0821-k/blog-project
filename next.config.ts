import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 썸네일 등 ImageKit에 업로드한 이미지를 next/image로 표시하기 위해 허용한다.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'ik.imagekit.io' }],
  },
}

export default nextConfig
