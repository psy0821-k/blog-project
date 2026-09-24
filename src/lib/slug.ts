import { randomUUID } from 'node:crypto'

/**
 * title로부터 URL-safe한 slug를 생성한다.
 * 한글 등 영숫자가 아닌 문자는 slug에 남기 어려워(공백 치환만으로는 URL-safe가 보장되지 않음)
 * 유일성 보장을 위해 uuid 일부를 접미사로 붙인다.
 */
export function generateSlug(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const suffix = randomUUID().slice(0, 8)

  return base ? `${base}-${suffix}` : suffix
}
