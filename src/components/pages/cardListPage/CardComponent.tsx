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
        {/* 글자 크기는 카드 폭에 맞춘다. 카드 폭은 2열(~639px) → 3열(640px~) → 사이드바가 생기는 1440px부터 커진다.
            sm:/md: 같은 표준 변형은 min-[1440px]: 변형보다 나중에 선언되어 덮어쓰므로 min-[Npx]: 변형으로 통일한다. */}
        <h3 className="my-2 break-words text-base font-medium min-[640px]:text-lg min-[768px]:text-xl min-[1440px]:text-2xl">
          {title}
        </h3>
        <p className="text-xs min-[640px]:text-sm min-[1440px]:text-base">{status}</p>
        <p className="text-xs text-gray-500 min-[1440px]:text-sm">
          {formatKoreanDate(new Date(createdAt))} | view {viewCount}
        </p>
      </Link>
    </article>
  )
}

export default CardComponent
