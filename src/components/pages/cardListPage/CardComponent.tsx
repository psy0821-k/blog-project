import Image from 'next/image'
import Link from 'next/link'
import { isVideoUrl } from '@/lib/media-validation'

interface CardProps {
  thumbnailUrl: string | null
  title: string
  href: string
}

export const CardComponent = ({ thumbnailUrl, title, href }: CardProps) => {
  return (
    <article>
      <Link href={href}>
        <div className="aspect-video bg-black">
          {thumbnailUrl && isVideoUrl(thumbnailUrl) ? (
            // 메타데이터만 받아 첫 프레임을 정지 이미지처럼 보여준다. 재생은 하지 않는다.
            <video
              src={`${thumbnailUrl}#t=0.001`}
              muted
              playsInline
              preload="metadata"
              aria-hidden
              tabIndex={-1}
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src={thumbnailUrl || '/fallback.webp'}
              alt=""
              width={300}
              height={200}
              aria-hidden
              className="w-full h-full object-contain"
            ></Image>
          )}
        </div>
        <h3 className="text-[18px] font-medium">{title}</h3>
      </Link>
    </article>
  )
}

export default CardComponent
