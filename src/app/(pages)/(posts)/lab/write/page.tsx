import AdminGuard from '@/components/common/AdminGuard'
import PostForm from '@/components/features/post-form/PostForm'

const LabWritePage = () => {
  return (
    <main className="content">
      <AdminGuard type="page">
        <PostForm type="lab" heading="Lab 글쓰기" />
      </AdminGuard>
    </main>
  )
}

export default LabWritePage
