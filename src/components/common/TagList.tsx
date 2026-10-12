interface TagListProps {
  tags: string[]
}

const TagList = ({ tags }: TagListProps) => {
  if (!tags.length) return null

  return (
    <ul aria-label="사용한 기술" className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-gray-300 px-2.5 py-0.5 text-xs text-gray-700"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

export default TagList
