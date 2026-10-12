import { formatStatusLines, type PostStatus } from '@/lib/post-status'

type StatusBadgeVariant = 'text' | 'circle'

interface StatusBadgeProps {
  status: PostStatus
  variant?: StatusBadgeVariant
  className?: string
}

const VARIANT_CLASS: Record<StatusBadgeVariant, string> = {
  // 카드: 글자 크기는 카드 폭에 맞춘다(min-[Npx]: 변형으로 통일)
  text: 'text-xs min-[640px]:text-sm min-[1440px]:text-base',
  circle:
    'w-20 aspect-square rounded-full bg-green-600 text-white text-[12px] font-bold flex items-center justify-center text-center leading-tight whitespace-pre-line hover:animate-[spin_4s_linear_infinite]',
}

// 상태는 영문 그대로 표시한다. 모양만 variant로 구분한다.
const StatusBadge = ({ status, variant = 'text', className = '' }: StatusBadgeProps) => (
  <span className={`${VARIANT_CLASS[variant]} ${className}`.trim()}>
    {variant === 'circle' ? formatStatusLines(status) : status}
  </span>
)

export default StatusBadge
