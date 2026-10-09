interface TagListProps {
  tags: string[]
}

const TagList = ({ tags }: TagListProps) => {
  if (!tags.length) return null

  return <p aria-label="사용한 기술">{tags.map((tag) => `#${tag}`).join(' ')}</p>
}

export default TagList
