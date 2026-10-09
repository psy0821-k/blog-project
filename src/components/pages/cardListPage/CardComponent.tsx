import Image from 'next/image'
import Link from 'next/link'
import { isVideoUrl } from '@/lib/media-validation'
import PostStatusBadge from '@/components/common/PostStatusBadge'
import type { PostStatus } from '@/lib/post-status'
import CardVideo from './CardVideo'

interface CardProps {
  thumbnailUrl: string | null
  title: string
  href: string
  status: PostStatus
}

export const CardComponent = ({ thumbnailUrl, title, href, status }: CardProps) => {
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
        <h3 className="text-[18px] font-medium">
          {title} <PostStatusBadge status={status} />
        </h3>
      </Link>
    </article>
  )
}

export default CardComponent
