# Blog

## 프로젝트를 시작한 이유

블로그는 개발자 포트폴리오에서 흔하게 볼 수 있는 프로젝트입니다.
하지만 게시글 작성과 조회처럼 기본적인 기능부터 사용자 인증, 데이터 처리, UI 구현까지 다양한 요소가 포함되기 때문에 개발자의 기본적인 구현 역량을 확인할 수 있는 프로젝트라고 생각했습니다.
그래서 단순히 기술을 보여주기 위한 블로그가 아니라, 제가 직접 운영하고 필요에 따라 계속 발전시킬 수 있는 개인 개발 블로그를 만들어보기로 했습니다.
이미 Notion이나 Velog처럼 개발 기록을 남길 수 있는 좋은 서비스가 있지만, 직접 만든 블로그라면 제가 원하는 UI와 기능을 자유롭게 구성할 수 있다는 장점이 있습니다.
처음에는 필요한 기능만 구현하고, 이후 실제로 사용하면서 불편한 점이나 추가하고 싶은 기능이 생기면 직접 개선해 나갈 계획입니다.
이를 통해 하나의 완성된 프로젝트를 만드는 것뿐만 아니라, 실제로 사용하면서 문제를 발견하고 개선하는 개발 과정 자체를 경험하는 것을 목표로 했습니다

## AI 활용에 대한 고민

이번 프로젝트에서는 AI를 단순히 코드를 생성하는 도구로 사용하는 것보다, 개발자의 기본기를 유지하면서 AI를 어떻게 효과적으로 활용할 수 있을지를 고민했습니다.

코드는 직접 작성하고 이슈 발행이나 pr을 작성하는 부분은 ai가 깔끔하게 작성한다고 생각했습니다.
다만 의도와 다르게 작성이 가능하기때문에 검증을 통해 확인 후 머지를 진행하는 방식으로 진행합니다

테스트 역시 역할을 나누었습니다.

사용자 관점의 테스트: 직접 브라우저에서 기능을 사용하며 검증
코드 및 기능 테스트: AI와 테스트 시나리오를 함께 정의하고 자동화 테스트 구현
문제 발생 시: AI에게 원인 분석을 요청하되, 제안된 해결 방법을 직접 검토하고 적용

이를 통해 개발자가 확인하고 ai는 문서정리와 테스트를 도와주는 보조수단으로 사용했습니다

## 🎯 Project Goal

- 실제 사용 가능한 블로그 서비스 구현
- 반응형 웹 UI 구현
- 게시글 CRUD 구현
- 회원가입 및 로그인 구현
- 댓글 기능 구현
- API와 UI 연동
- 입력 데이터 검증
- 서버 상태 관리
- 주요 사용자 흐름 테스트

## 🛠 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- TanStack Query
- Zod

### Backend

- Next.js API
- PostgreSQL
- ORM — 추후 결정

### Testing

- Playwright

### Tools

- Git / GitHub
- Figma

## 📌 MVP Features

### 1. Blog

- 게시글 목록
- 게시글 상세
- 게시글 검색
- 게시글 작성
- 게시글 수정
- 게시글 삭제

### 2. Authentication

- 회원가입
- 로그인
- 로그아웃
- 인증 상태 관리

### 3. Comment

- 댓글 조회
- 댓글 작성
- 댓글 수정
- 댓글 삭제
- 작성자 권한 확인

## 🔄 Data Flow

```text
User
 ↓
UI
 ↓
TanStack Query
 ↓
API
 ↓
Zod Validation
 ↓
PostgreSQL
```

## 🔐 Validation

사용자가 입력하는 데이터는 서버에서 검증합니다.

- 회원가입 데이터 검증
- 로그인 요청 검증
- 게시글 데이터 검증
- 댓글 데이터 검증
- API 요청 데이터 검증

Zod를 활용하여 API에서 요구하는 데이터 형식을 명확하게 정의하고 잘못된 입력을 처리합니다.

## ⚡ Server State

TanStack Query를 사용하여 서버에서 관리되는 데이터를 처리합니다.

- 게시글 조회
- 댓글 조회
- 게시글 작성 / 수정 / 삭제
- 댓글 작성 / 수정 / 삭제
- Loading 상태
- Error 상태
- Cache 관리
- Query Invalidation

## ♿ Accessibility

블로그 이용에 필요한 기본적인 웹 접근성을 고려합니다.

- Semantic HTML
- 적절한 Heading 구조
- Form Label
- 키보드 접근성
- Focus 상태
- 이미지 대체 텍스트
- 적절한 ARIA 사용
- 색상 대비

## 📱 Responsive

Desktop, Tablet, Mobile 환경에서 사용할 수 있도록 반응형 UI를 구현합니다.

| Device  | Target |
| ------- | ------ |
| Desktop | 1440px |
| Tablet  | 768px  |
| Mobile  | 375px  |

## 🧪 Testing

주요 사용자 흐름을 중심으로 E2E 테스트를 작성합니다.

```text
회원가입
 ↓
로그인
 ↓
게시글 조회
 ↓
게시글 작성
 ↓
게시글 수정
 ↓
댓글 작성
 ↓
댓글 수정 / 삭제
```

## 🚀 Development Process

```text
UI Publishing
 ↓
Database Design
 ↓
API / Backend
 ↓
Zod Validation
 ↓
TanStack Query
 ↓
UI Integration
 ↓
Authentication
 ↓
Comment
 ↓
Testing
 ↓
Accessibility / Performance Check
```

## 📌 MVP Scope

```text
[Blog]

게시글
 ├─ 목록
 ├─ 상세
 ├─ 검색
 ├─ 작성
 ├─ 수정
 └─ 삭제

사용자
 ├─ 회원가입
 ├─ 로그인
 └─ 로그아웃

댓글
 ├─ 조회
 ├─ 작성
 ├─ 수정
 └─ 삭제
```

## 🔗 Links

- Demo: 준비 중
- GitHub: 준비 중
