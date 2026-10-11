import { PostStatus } from '@/lib/post-status'
import Image from 'next/image'
import TypingText from '@/components/common/TypingText'
import { isVideoUrl } from '@/lib/media-validation'
import SummaryVideo from './SummaryVideo'

const COVER_CLASS =
  'w-full h-auto aspect-video rounded-2xl object-cover min-[1440px]:flex-1 min-[1440px]:min-w-0'

interface SummaryProps {
  title: string
  thumbnailUrl: string | null
  status: PostStatus
  createdAt: Date
  updatedAt: Date
  viewCount: number
  category: string | null
  technologies: string[]
  description: string | null
}

const ProjectSummary = ({
  title,
  thumbnailUrl,
  status,
  createdAt,
  updatedAt,
  viewCount,
  category,
  technologies,
  description,
}: SummaryProps) => {
  return (
    <section className="relative flex flex-col gap-9 min-[1440px]:flex-row min-[1440px]:items-center">
      {thumbnailUrl && isVideoUrl(thumbnailUrl) ? (
        <SummaryVideo src={thumbnailUrl} className={COVER_CLASS} />
      ) : (
        <Image
          src={thumbnailUrl || '/fallback.webp'}
          alt=""
          width={640}
          height={360}
          loading="eager"
          className={COVER_CLASS}
        />
      )}
      <div className="min-[1440px]:flex-1 min-[1440px]:min-w-0">
        <header>
          <h1>
            <TypingText text={title} />
          </h1>
          <span className="mt-2 text-sm text-gray-500">
            <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleDateString('ko-KR')}</time>
            <span aria-hidden="true" className="mx-2">
              |
            </span>
            조회 {viewCount}
          </span>
        </header>
        <div className="mt-8">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {updatedAt.getTime() > createdAt.getTime() && (
              <>
                <dt>최근 수정일</dt>
                <dd>
                  <time dateTime={updatedAt.toISOString()}>
                    {updatedAt.toLocaleDateString('ko-KR')}
                  </time>
                </dd>
              </>
            )}
            {category && (
              <>
                <dt>프로젝트 유형</dt>
                <dd>{category}</dd>
              </>
            )}
            {technologies.length > 0 && (
              <>
                <dt>기술 스택</dt>
                <dd>{technologies.join(', ')}</dd>
              </>
            )}
            {description && (
              <>
                <dt>설명</dt>
                <dd>{description}</dd>
              </>
            )}
          </dl>
          <hr className="my-4" />
          <span className="w-20 aspect-square rounded-full bg-green-600 text-white text-[12px] font-bold flex items-center justify-center text-center leading-tight whitespace-pre-line hover:animate-[spin_4s_linear_infinite]">
            {status.replaceAll('_', '\n')}
          </span>
        </div>
      </div>
    </section>
  )
}

export default ProjectSummary
