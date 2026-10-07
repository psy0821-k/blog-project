import AdminGuard from '@/components/common/AdminGuard'
import PostForm from '@/components/features/post-form/PostForm'

const ProjectsWritePage = () => {
  return (
    <main className="content">
      <AdminGuard type="page">
        <PostForm type="projects" heading="Projects 글쓰기" />
      </AdminGuard>
    </main>
  )
}

export default ProjectsWritePage
