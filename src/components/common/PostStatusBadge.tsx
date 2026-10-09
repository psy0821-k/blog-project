import { POST_STATUS_LABEL, type PostStatus } from '@/lib/post-status'

interface PostStatusBadgeProps {
  status: PostStatus
}

const PostStatusBadge = ({ status }: PostStatusBadgeProps) => {
  return <span>[{POST_STATUS_LABEL[status]}]</span>
}

export default PostStatusBadge
