const DISPLAY_TIME_ZONE = 'Asia/Seoul'

/**
 * 날짜를 한국 시간 기준 'YYYY. M. D.' 형식으로 표시한다.
 * 서버 컴포넌트는 서버 시간대(Vercel은 UTC)로 계산하면 날짜가 하루 어긋나므로 시간대를 고정한다.
 */
export function formatKoreanDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', { timeZone: DISPLAY_TIME_ZONE })
}
