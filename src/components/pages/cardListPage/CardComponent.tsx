import Image from 'next/image'
import Link from 'next/link'

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
          <Image
            src={thumbnailUrl || '/fallback.webp'}
            alt=""
            width={300}
            height={200}
            aria-hidden
            className="w-full h-full object-contain"
          ></Image>
        </div>
        <h3 className="text-[18px] font-medium">{title}</h3>
      </Link>
    </article>
  )
}

export default CardComponent
