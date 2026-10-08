import PostEditPage from '@/components/features/post-form/PostEditPage'

interface ProjectEditPageProps {
  params: Promise<{ slug: string }>
}

const ProjectEditPage = async ({ params }: ProjectEditPageProps) => {
  const { slug } = await params

  return <PostEditPage type="projects" slug={slug} heading="Projects 글 수정" />
}

export default ProjectEditPage
