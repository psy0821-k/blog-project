import Image from 'next/image'
import Link from 'next/link'
import { formatKoreanDate } from '@/lib/format-date'
import { isVideoUrl } from '@/lib/media-validation'
import type { PostStatus } from '@/lib/post-status'
import CardVideo from './CardVideo'

interface CardProps {
  thumbnailUrl: string | null
  title: string
  href: string
  status: PostStatus
  createdAt: string
  viewCount: number
}

export const CardComponent = ({
  thumbnailUrl,
  title,
  href,
  status,
  createdAt,
  viewCount,
}: CardProps) => {
  return (
    <article>
      <Link href={href}>
        <div className="aspect-video bg-black">
          {thumbnailUrl && isVideoUrl(thumbnailUrl) ? (
            <CardVideo src={thumbnailUrl} />
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
        <h3 className="text-[24px] font-medium my-2">{title}</h3>
        <p>{status}</p>
        <p className="text-gray-500 text-[12px]">
          {formatKoreanDate(new Date(createdAt))} | view {viewCount}
        </p>
      </Link>
    </article>
  )
}

export default CardComponent
