---
title: NextAuth 로그인 시 Configuration 에러 — PrismaAdapter가 요구하는 컬럼 누락
date: 2026-09-24
tags: [nextauth, authjs, prisma, prismaadapter, oauth, troubleshooting]
---

## 배경

[[2026-09-23-nextauth-session-strategy-jwt]]에서 `session.strategy`를 `jwt`로 전환한 뒤, Google OAuth 로그인을 실제로 테스트했다. 이 과정에서 스키마 정리 단계(`Account`에서 `refresh_token`/`access_token` 제거, `User`에 `emailVerified`/`image` 미포함)의 영향이 실제로 로그인 흐름을 깨뜨리는지 확인이 필요했다.

## 문제 1: Google 로그인 시 Configuration 에러

로그인 버튼(Google)을 누르면 Google 인증 자체(동의 화면)는 성공하고 `/api/auth/callback/google`까지 정상 도달하지만, 그 이후 브라우저가 `/api/auth/error?error=Configuration`으로 리다이렉트되며 "Server error / There is a problem with the server configuration"이 표시됐다.

개발 서버 로그를 확인하자 실제 원인이 드러났다.

```
[auth][error] AdapterError
[auth][cause]: PrismaClientKnownRequestError:
Invalid `p.account.findUnique()` invocation
The column `(not available)` does not exist in the current database.
    at getUserByAccount (...)
```

이후 같은 방식으로 두 번째 에러가 이어졌다.

```
Invalid `p.user.findUnique()` invocation
The column `(not available)` does not exist in the current database.
    at getUserByEmail (...)
```

### 원인

`@auth/prisma-adapter`의 `PrismaAdapter`는 Auth.js 표준 스키마에 정의된 컬럼들을 **내부적으로 무조건 select**한다. 이전에 "provider API를 호출할 계획이 없으니 필요 없다"고 판단해 제거했던 필드들이, 실제로는 어댑터의 고정된 쿼리 로직이 참조하는 필수 컬럼이었다.

- `Account.refresh_token`, `Account.access_token`: `getUserByAccount` 내부 쿼리가 select — provider API 사용 여부와 무관하게 어댑터가 항상 요구
- `User.emailVerified`, `User.image`: `getUserByEmail` 등 어댑터의 User 조회 쿼리가 요구하는 표준 필드

즉 "이 필드가 실제로 값이 채워지는가"와 "이 필드가 스키마에 존재해야 하는가"는 다른 문제였다. 값은 계속 `null`이어도 되지만, **컬럼 자체는 어댑터 코드가 하드코딩한 select 대상이라 없으면 무조건 에러가 난다.**

### 해결

1. `Account` 모델에 `refresh_token String? @db.Text`, `access_token String? @db.Text` 추가
2. `User` 모델에 `emailVerified DateTime?`, `image String?` 추가
3. `npx prisma migrate dev`로 두 단계 마이그레이션 적용 (`add_account_tokens`, `add_user_adapter_fields`)
4. `npx prisma generate`로 Prisma Client 재생성
5. **개발 서버(Next.js dev, Turbopack)를 완전히 재시작** — 이미 실행 중이던 프로세스는 이전 Prisma Client를 메모리에 들고 있어, `generate`만으로는 반영되지 않고 계속 같은 에러가 재현됐다. 프로세스를 종료하고 `npm run dev`를 다시 실행한 뒤에야 해결됐다.

## 문제 2: GitHub 로그인 시 incorrect_client_credentials

Google 로그인 성공을 확인한 뒤 GitHub OAuth App을 등록하고 `.env`에 `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`을 추가했다. 로그인을 시도하자 다시 `error=Configuration`이 떴는데, 이번엔 로그의 원인이 달랐다.

```
[auth][details]: {
  "body": {
    "error": "incorrect_client_credentials",
    "error_description": "The client_id and/or client_secret passed are incorrect."
  },
  "provider": "github"
}
```

### 원인

`.env`에 입력한 `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` 값이 실제 GitHub OAuth App의 값과 일치하지 않았다. Client Secret은 GitHub에서 발급 시 한 번만 표시되므로, 값을 잘못 복사했거나 발급하지 않은 상태로 진행했을 가능성이 컸다.

### 해결

GitHub OAuth App 설정 페이지에서 Client Secret을 다시 "Generate a new client secret"으로 재발급하고, `.env` 값을 교체한 뒤 서버를 재시작해 해결했다.

## 문제 3: GitHub 로그인 시 OAuthAccountNotLinked

Client 자격 증명 문제를 해결한 뒤 다시 로그인을 시도하자, 이번엔 `/login?error=OAuthAccountNotLinked`로 리다이렉트됐다.

### 원인

이미 Google 계정으로 로그인해 생성된 `User` 레코드(email 기준)가 있는 상태에서, 같은 이메일을 쓰는 GitHub 계정으로 로그인을 시도했다. Auth.js는 기본적으로 **같은 이메일이라도 다른 provider의 계정을 자동으로 연결하지 않는다** — 이메일 스푸핑을 통한 계정 탈취를 막기 위한 보안 정책이다.

### 해결

개인 블로그이고 본인이 이메일 신뢰 관계를 직접 파악하고 있는 상황이라, `allowDangerousEmailAccountLinking: true`를 두 provider 모두에 설정해 같은 이메일이면 자동으로 계정을 연결하도록 허용했다.

```ts
providers: [
  Google({ allowDangerousEmailAccountLinking: true }),
  GitHub({ allowDangerousEmailAccountLinking: true }),
],
```

이 옵션은 이름 그대로 "위험한" 설정이다 — 여러 사용자가 가입하는 서비스에서는 이메일 검증이 안 된 provider(자체 이메일 인증을 안 하는 provider)와 조합될 경우 계정 탈취 벡터가 될 수 있다. 신뢰할 수 있는 provider(Google, GitHub 모두 이메일 인증 보장)만 쓰는 개인 블로그이므로 허용 가능하다고 판단했다.

## 배운 점

- `PrismaAdapter`를 쓸 경우, Prisma 스키마는 "우리가 실제로 쓸 필드"가 아니라 **Auth.js가 명세한 표준 스키마**를 그대로 따라야 한다. 필드를 지울 때는 "이 값을 우리가 쓰는가"가 아니라 "어댑터 내부 쿼리가 이 컬럼을 참조하는가"를 먼저 확인해야 했다.
- Prisma 스키마를 변경한 뒤 `migrate dev` + `generate`까지 했더라도, **이미 떠 있는 Next.js dev 서버는 재시작해야 새 Prisma Client가 반영된다.** 스키마를 바꿨는데 같은 에러가 반복되면 가장 먼저 서버 재시작 여부를 확인할 것.
- NextAuth의 `error=Configuration`은 실제로는 다양한 원인(시크릿 누락, 어댑터 쿼리 실패, provider 자격 증명 오류 등)을 모두 같은 일반적인 문구로 감싸서 보여준다. 브라우저 화면만으로는 원인을 알 수 없고, 반드시 서버 콘솔 로그(`[auth][cause]`, `[auth][details]`)를 확인해야 한다.
- 여러 provider를 동시에 쓸 때는 "같은 이메일, 다른 provider" 케이스를 반드시 염두에 둬야 한다. 기본 동작(연결 거부)과 그 이유를 이해하고 나서 `allowDangerousEmailAccountLinking` 여부를 판단해야 한다.
