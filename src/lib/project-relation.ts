import { badRequestResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

/**
 * 개발일지에 지정하려는 projectId가 실제 PROJECT 글인지 확인한다.
 * 지정하지 않았거나(undefined) 연결을 해제하는 경우(null)는 검증할 것이 없어 통과시킨다.
 * 유효하지 않으면 400 응답을, 문제없으면 null을 반환하므로 호출부에서 응답이 있으면 그대로 반환한다.
 */
export async function validateProjectForDevLog(projectId: string | null | undefined) {
  if (!projectId) {
    return null
  }

  const project = await prisma.post.findUnique({
    where: { id: projectId },
    select: { type: true },
  })

  if (!project || project.type !== 'PROJECT') {
    return badRequestResponse('유효하지 않은 프로젝트입니다.')
  }

  return null
}
