import PostEditPage from '@/components/features/post-form/PostEditPage'

interface LabEditPageProps {
  params: Promise<{ slug: string }>
}

const LabEditPage = async ({ params }: LabEditPageProps) => {
  const { slug } = await params

  return <PostEditPage type="lab" slug={slug} heading="Lab 글 수정" />
}

export default LabEditPage
