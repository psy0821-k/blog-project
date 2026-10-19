import { formatStatusLines, type PostStatus } from '@/lib/post-status'

type StatusBadgeVariant = 'text' | 'circle'

interface StatusBadgeProps {
  status: PostStatus
  variant?: StatusBadgeVariant
  className?: string
}

// 원형 배지만 상태별 배경색을 쓴다. 텍스트형(목록 카드)은 기본 글자색.
const CIRCLE_COLOR_CLASS: Record<PostStatus, string> = {
  IN_PROGRESS: 'bg-green-600',
  COMPLETED: 'bg-blue-600',
  UP_COMING: 'bg-red-600',
}

const VARIANT_CLASS: Record<StatusBadgeVariant, string> = {
  // 카드: 글자 크기는 카드 폭에 맞춘다(min-[Npx]: 변형으로 통일)
  text: 'text-xs min-[640px]:text-sm min-[1440px]:text-base',
  circle:
    'w-20 aspect-square rounded-full text-white text-[12px] font-bold flex items-center justify-center text-center leading-tight whitespace-pre-line hover:animate-[spin_4s_linear_infinite]',
}

// 상태는 영문 그대로 표시한다. 모양만 variant로 구분한다.
const StatusBadge = ({ status, variant = 'text', className = '' }: StatusBadgeProps) => (
  <span
    className={`${VARIANT_CLASS[variant]} ${
      variant === 'circle' ? CIRCLE_COLOR_CLASS[status] : ''
    } ${className}`.trim()}
  >
    {variant === 'circle' ? formatStatusLines(status) : status}
  </span>
)

export default StatusBadge
