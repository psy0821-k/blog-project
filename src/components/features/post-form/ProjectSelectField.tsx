'use client'

import { usePostList } from '@/hooks/use-post-list'

interface ProjectSelectFieldProps {
  // 선택한 프로젝트의 id. 빈 문자열이면 연결하지 않는다.
  value: string
  onChange: (projectId: string) => void
}

// 개발일지가 속할 프로젝트를 고른다. 발행된 프로젝트만 목록에 나타난다.
const ProjectSelectField = ({ value, onChange }: ProjectSelectFieldProps) => {
  const { data } = usePostList('projects', { pageSize: 50 })
  const projects = data?.data ?? []

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="post-project" className="text-sm font-semibold">
        프로젝트
      </label>
      <select
        id="post-project"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
      >
        <option value="">연결하지 않음</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProjectSelectField
