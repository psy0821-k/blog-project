import AdminGuard from '@/components/common/AdminGuard'
import PostForm from '@/components/features/post-form/PostForm'

const DevLogWritePage = () => {
  return (
    <main className="content">
      <AdminGuard type="page">
        <PostForm type="devlog" heading="개발 일지 글쓰기" />
      </AdminGuard>
    </main>
  )
}

export default DevLogWritePage
