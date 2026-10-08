# Issue #13 — Projects 글 작성 폼 + 에디터 구현 (react-quill-new)

> spec 문서는 따로 두지 않았다. 범위는 이슈 #13 본문 + 이후 합의한 추가 항목(slug 직접 입력, 썸네일 업로드, 메타 제목/설명, 공개 여부)이다.
> 경로는 이슈의 `projects/new`가 아니라 현재 코드 기준 `/projects/write`다. Lab(`/lab/write`, `POST /api/lab`)은 #27 범위라 제외한다.

## 시그니처

```ts
// src/hooks/use-create-post.ts
type CreatePostType = 'projects' | 'lab'
interface CreatedPost { id: string; slug: string }

function createPost(type: CreatePostType, input: CreateProjectInput): Promise<CreatedPost>
// 에러: 응답이 !ok면 Error(서버 error.message)
//       에러 본문이 없거나 JSON이 아니면 Error('게시글을 저장하지 못했습니다. (상태코드)')

function useCreatePost(type: CreatePostType): UseMutationResult<CreatedPost, Error, CreateProjectInput>
// 성공 시 ['posts', type] 쿼리 무효화

// src/lib/post-schema.ts
const slugSchema // trim → 소문자화 → 1~100자 → /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u
const createProjectSchema
// title(trim, 1자 이상), content(string), published(boolean, 필수)
// slug · categoryId(uuid) · thumbnailUrl(url) · metaTitle · metaDescription · mediaUrls(url[]) 는 선택

// src/components/features/post-form/PostForm.tsx
interface PostFormProps { type: CreatePostType; heading: string }
// 저장 성공 → router.push(`/${type}`)
// 저장 실패 → 이동하지 않고 error.message 표시, 입력값 유지
// 비어 있는 선택 값(slug, categoryId, thumbnailUrl, 메타)은 '' 대신 undefined로 전송

// src/components/features/post-form/ThumbnailField.tsx
interface ThumbnailFieldProps {
  value: UploadedMedia | null
  onChange: (thumbnail: UploadedMedia | null) => void
}
// 업로드 실패 시 onChange를 호출하지 않는다(기존 값 유지)
// 교체/제거 시 이전 파일을 deleteFile로 삭제한다

// src/components/common/AdminGuard.tsx
interface AdminGuardProps { children: ReactNode; type?: 'page' | 'element' }
// 비관리자: type='page'면 <NotFound />, 'element'면 null

// 라우트
// /projects/write  — 관리자만 폼 표시(AdminGuard type='page')
// /projects        — 관리자에게만 "프로젝트 추가하기" 링크 표시
// POST /api/projects — 403(비관리자) / 400(JSON 오류·검증 실패·잘못된 서브메뉴) / 409(slug 중복) / 201(생성된 Post)
```

## 테스트 수준

| 대상 | 수준 | 비고 |
| --- | --- | --- |
| `createPost`, `slugSchema`, `createProjectSchema` | 단위 (vitest) | 설정 변경 없이 가능 |
| `PostForm`, `AdminGuard`, 페이지 | E2E (Playwright, `page.route`로 세션/API 모킹) | 로그인 없이 검증, 컴포넌트 테스트 도구 추가 없음 |
| `POST /api/projects` | API (vitest + `vi.mock`) | `vitest.config`에 `@/` alias 추가 필요 — 포함 여부는 승인 시 결정 |

## 테스트 시나리오

### createPost (단위)

- [정상] createPost — type이 projects일 때 `/api/projects`로 JSON을 POST하고 생성된 `{ id, slug }`를 반환해야 한다
- [정상] createPost — type이 lab일 때 `/api/lab`으로 요청해야 한다
- [예외] createPost — 서버가 `error.message`를 담아 실패를 응답하면 그 메시지로 Error를 던져야 한다
- [예외] createPost — 에러 본문이 없거나 JSON이 아니면 상태 코드가 담긴 기본 메시지로 Error를 던져야 한다

### slugSchema (단위)

- [정상] slugSchema — 영문·숫자·한글을 하이픈으로 이은 값(`my-first-post`, `첫-번째-글`)을 허용해야 한다
- [경계] slugSchema — 대문자가 섞여 있으면 소문자로 정규화해야 한다
- [경계] slugSchema — 앞뒤 공백은 제거해야 한다
- [경계] slugSchema — 100자는 허용하고 101자는 거부해야 한다
- [예외] slugSchema — 빈 문자열, 공백만 있는 값, 중간 공백, 앞/뒤/연속 하이픈, `/`·`?` 같은 특수문자는 거부해야 한다

### createProjectSchema (단위)

- [정상] createProjectSchema — title, content, published만 있어도 통과해야 한다
- [경계] createProjectSchema — title이 공백뿐이면 거부해야 한다
- [예외] createProjectSchema — published가 없으면 거부해야 한다
- [예외] createProjectSchema — categoryId가 uuid가 아니거나 빈 문자열이면 거부해야 한다
- [예외] createProjectSchema — thumbnailUrl이 URL 형식이 아니거나 빈 문자열이면 거부해야 한다
- [예외] createProjectSchema — slug가 빈 문자열이면 거부해야 한다(폼은 비어 있으면 생략해서 보낸다)

### PostForm — 저장 (E2E)

- [정상] PostForm — 제목과 본문을 입력하고 저장하면 `POST /api/projects`로 title, content, `published: true`를 보내고 `/projects`로 이동해야 한다
- [정상] PostForm — 저장 후 이동한 목록에 방금 저장한 글의 카드가 나타나야 한다(목록 캐시가 갱신되어야 한다)
- [정상] PostForm — slug, 서브메뉴, 메타 제목/설명, 썸네일을 비워 두면 요청 본문에 해당 키를 포함하지 않아야 한다
- [정상] PostForm — slug와 메타 제목/설명을 입력하면 앞뒤 공백을 제거해 전송해야 한다
- [정상] PostForm — 서브메뉴를 선택하면 해당 categoryId를 전송해야 한다
- [정상] PostForm — 서브메뉴 선택 목록에 미분류와 PROJECT 종류의 서브메뉴가 표시되어야 한다
- [정상] PostForm — 공개 체크를 해제하고 저장하면 `published: false`를 전송해야 한다
- [경계] PostForm — 저장 요청 중에는 저장 버튼이 비활성화되고 "저장 중..."으로 표시되어야 한다
- [경계] PostForm — 취소를 누르면 이전 화면으로 돌아가고 요청을 보내지 않아야 한다

### PostForm — 검증과 실패 (E2E)

- [예외] PostForm — 제목이 비어 있을 때 저장하면 요청을 보내지 않고 "제목을 입력하세요."를 표시해야 한다
- [경계] PostForm — 제목이 공백뿐일 때 저장하면 요청을 보내지 않고 오류 메시지를 표시해야 한다
- [정상] PostForm — 제목 오류가 표시된 뒤 제목을 입력하고 다시 저장하면 오류가 사라지고 요청을 보내야 한다
- [예외] PostForm — slug 형식이 올바르지 않으면 요청을 보내지 않고 안내 문구를 표시해야 한다
- [정상] PostForm — slug를 비워 두면 형식 오류 없이 저장 요청을 보내야 한다
- [예외] PostForm — 저장 요청이 400/409/500으로 실패하면 이동하지 않고 서버 메시지를 표시하며 입력한 제목·slug·본문·메타를 유지해야 한다
- [예외] PostForm — 네트워크 오류로 실패하면 이동하지 않고 오류 메시지를 표시하며 입력값을 유지해야 한다
- [정상] PostForm — 실패한 뒤 다시 저장하면 같은 입력값으로 재요청해야 한다

### ThumbnailField — 제외

- 업로드·교체·제거·실패 동작은 직접 확인을 마쳤고, ImageKit 업로드 모킹 비용이 커서 자동 테스트 시나리오에서 제외한다.

### AdminGuard와 페이지 접근 (E2E)

- [정상] AdminGuard — 관리자 세션이면 /projects/write에서 글쓰기 폼이 표시되어야 한다
- [예외] AdminGuard — 비로그인 세션이면 /projects/write에서 폼 대신 404 화면이 표시되어야 한다
- [예외] AdminGuard — 관리자가 아닌 세션이면 /projects/write에서 404 화면이 표시되어야 한다
- [정상] AdminGuard — type이 element이면 비관리자에게 아무것도 렌더링하지 않아야 한다
- [정상] 프로젝트 목록 — 관리자에게만 "프로젝트 추가하기" 링크가 보이고, 누르면 /projects/write로 이동해야 한다
- [예외] 프로젝트 목록 — 비관리자에게는 "프로젝트 추가하기" 링크가 보이지 않아야 한다

### POST /api/projects (API)

- [정상] POST /api/projects — 관리자가 유효한 본문을 보내면 type이 PROJECT인 글을 저장하고 201과 생성된 글을 반환해야 한다
- [정상] POST /api/projects — slug를 지정하면 그 값을 저장하고, 생략하면 제목으로 자동 생성한 slug를 저장해야 한다
- [정상] POST /api/projects — mediaUrls가 있으면 글과 함께 Media를 생성해야 한다
- [정상] POST /api/projects — 요청 본문에 type이 있어도 무시하고 항상 PROJECT로 저장해야 한다
- [예외] POST /api/projects — 관리자가 아니면 403을 반환하고 저장하지 않아야 한다
- [예외] POST /api/projects — JSON이 올바르지 않으면 400을 반환해야 한다
- [예외] POST /api/projects — 제목이 비어 있으면 400과 검증 오류 상세를 반환해야 한다
- [예외] POST /api/projects — 다른 종류(LAB)의 서브메뉴 id를 보내면 400을 반환해야 한다
- [예외] POST /api/projects — 이미 사용 중인 slug이면 409를 반환하고 글과 Media를 저장하지 않아야 한다

### useCreatePost (E2E로 간접 검증)

- [정상] useCreatePost — 저장에 성공하면 해당 종류의 목록 쿼리를 무효화해 이동한 목록이 최신 데이터를 보여줘야 한다 (PostForm 저장 시나리오에서 검증)
- [예외] useCreatePost — 저장에 실패하면 목록 쿼리를 무효화하지 않고 error에 서버 메시지를 담아야 한다 (PostForm 실패 시나리오에서 검증)

## AC 커버리지

| AC (이슈 #13) | 커버하는 시나리오 |
| --- | --- |
| 1. 관리자가 projects 글쓰기에서 제목과 본문을 입력해 저장하면 글이 저장되고 목록에 카드가 나타난다 | PostForm — 저장(1, 2번째), AdminGuard — 폼 표시, POST /api/projects — 201 저장, useCreatePost 무효화 |
| 2. 제목이 비어 있을 때 저장하면 요청이 전송되지 않고 오류 메시지가 표시된다 | PostForm — 검증(제목 비어 있음, 공백뿐, 재저장) |
| 3. 저장 요청이 실패했을 때 입력한 내용이 유지되고 실패 메시지가 표시된다 | PostForm — 검증과 실패(400/409/500, 네트워크 오류, 재저장) |
