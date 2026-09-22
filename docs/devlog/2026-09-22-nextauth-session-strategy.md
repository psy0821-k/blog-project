---
title: NextAuth 세션 전략 트러블슈팅 — Credentials와 Database 세션은 공존할 수 없다
date: 2026-09-22
tags: [nextauth, authjs, session, troubleshooting]
---

## 배경

1. 테스트 용도로 자체 회원가입(이메일/비밀번호) 기능을 추가하려 했다.
2. 로그인 방식을 유연하게 가져가고 싶어서 NextAuth(Auth.js)를 도입하기로 했다.

## 문제

NextAuth 공식 문서를 확인하던 중, `Credentials` Provider(자체 이메일/비밀번호 로그인)를 사용하면 **Database 세션 전략을 지원하지 않는다**는 제약을 발견했다.

```typescript
// next-auth 내부 assert 로직 (요약)
if (hasCredentials) {
  const dbStrategy = options.session?.strategy === "database"
  const onlyCredentials = !options.providers.some(
    (p) => (typeof p === "function" ? p() : p).type !== "credentials"
  )
  if (dbStrategy && onlyCredentials) {
    throw new UnsupportedStrategy(
      "Signing in with credentials only supported if JWT strategy is enabled"
    )
  }
}
```

즉 Credentials를 쓰는 순간 세션은 **JWT 방식으로만** 동작한다. 반면 이 프로젝트는 스키마 설계 단계에서 이미 "서버에서 즉시 세션 무효화가 가능하다"는 이유로 **Database 세션**을 채택하기로 결정한 상태였다. 두 결정이 서로 충돌했다.

## 검토한 선택지

| 선택지 | 내용 |
|---|---|
| A. JWT 세션으로 전환 | Credentials를 유지하되 세션 전략을 JWT로 바꾼다 |
| B. Credentials 제거, Database 세션 유지 | 자체 로그인을 포기하고 OAuth(Google/GitHub)만 사용한다 |

처음엔 A로 진행하여 `next-auth@5(beta)` + Credentials + JWT 세션 조합으로 구현했다(`bcryptjs`로 비밀번호 해시 검증, `authorize` 콜백에서 `passwordHash` 대조).

## 최종 결정: Credentials 제거

이후 다시 검토하면서, 구글과 깃허브 OAuth 연동만으로도 보안성을 충분히 챙길 수 있다고 판단했다. OAuth는 각 플랫폼이 비밀번호 관리·2단계 인증·이상 로그인 탐지를 대신 처리해주기 때문에, 자체 비밀번호 저장/검증 로직(해시 알고리즘 선택, 솔팅, 브루트포스 방어 등)을 직접 구현하고 책임져야 하는 부담이 없다.

그리고 애초에 **Database 세션을 쓰기로 한 기존 방침을 따르는 것**이 이 프로젝트의 우선순위에 더 맞다고 판단해, 자체 로그인(Credentials)을 제거하는 쪽(B)으로 최종 결정했다.

### 실제 변경 사항

- `src/auth.config.ts`: `Credentials` provider 제거, `providers: [Google, GitHub]`만 유지
- `session.strategy`: `"jwt"` → `"database"`로 환원
- `session` 콜백 시그니처 변경: JWT 방식의 `{ session, token }` → Database 방식의 `{ session, user }`
- `src/types/next-auth.d.ts`: 더 이상 쓰지 않는 `next-auth/jwt` 모듈 확장 제거
- `bcryptjs`, `@types/bcryptjs` 패키지 제거
- Prisma 스키마: `User.passwordHash` 필드 삭제, 관련 마이그레이션 적용 (`remove_password_hash`)
- `VerificationToken` 모델은 삭제하지 않고 유지 — Auth.js 표준 모델이라 `PrismaAdapter`가 내부적으로 참조할 수 있어서 스키마에는 남겨두고 주석만 "OAuth adapter 내부용"으로 정정

## 배운 점

- NextAuth(Auth.js)에서 **세션 전략은 provider 선택과 독립적인 설정이 아니다.** Credentials를 쓸지 여부를 먼저 정해야 세션 전략의 선택지가 정해진다.
- "로그인 방식을 유연하게 가져가고 싶다"는 목표와 "서버에서 세션을 확실히 통제하고 싶다(Database 세션)"는 목표가 항상 함께 가지 않을 수 있다는 걸 실제로 라이브러리 제약에 부딪히고서야 알았다. 스키마/아키텍처를 먼저 정하고 나서 인증 라이브러리를 붙이면, 이런 제약은 구현 직전에야 드러난다 — 인증 방식(Credentials 포함 여부)과 세션 전략은 계획 단계에서 같이 묶어 검토했어야 하는 항목이었다.
