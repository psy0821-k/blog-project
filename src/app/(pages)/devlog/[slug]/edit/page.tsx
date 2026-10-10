import PostEditPage from '@/components/features/post-form/PostEditPage'

interface DevLogEditPageProps {
  params: Promise<{ slug: string }>
}

const DevLogEditPage = async ({ params }: DevLogEditPageProps) => {
  const { slug } = await params

  return <PostEditPage type="devlog" slug={slug} heading="개발 일지 수정" />
}

export default DevLogEditPage
