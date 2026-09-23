---
title: NextAuth 세션 전략 재검토 — Database에서 JWT로 전환
date: 2026-09-23
tags: [nextauth, authjs, session, prisma, troubleshooting]
---

## 배경

[[2026-09-22-nextauth-session-strategy]] 문서에서 Credentials(자체 로그인)를 제거하고 OAuth(Google/GitHub)만 남기면서, "서버에서 세션을 즉시 무효화할 수 있어야 한다"는 이유로 Database 세션 전략을 유지하기로 했었다. 이 전략을 쓰려면 Prisma 스키마에 `Session` 모델이 있어야 한다.

## 문제

스키마를 다시 정리하는 과정에서 `Session`, `VerificationToken` 모델을 제거했다. `VerificationToken`은 이메일 인증/매직링크 전용이라 OAuth만 쓰는 이 프로젝트에는 애초에 불필요했고, `Session`은 "비밀번호 변경 시 특정 유저의 전체 세션을 무효화한다"는 주석이 달려 있었는데, 이 프로젝트에는 **비밀번호 변경 기능 자체가 없다**는 게 확인됐다. 즉 Database 세션을 유지해야 했던 근거(세션 강제 무효화 기능)가 실제로는 쓰이지 않는 요구사항이었다.

그런데 `src/auth.config.ts`는 여전히 `session.strategy: "database"`로 설정돼 있어서, `Session` 모델이 없는 스키마와 충돌하는 상태로 남아 있었다.

## 검토

| 선택지 | 내용 |
|---|---|
| A. JWT로 전환 | `Session` 모델 없이, 쿠키에 암호화된 토큰만으로 세션 유지 |
| B. `Session` 모델을 되살리고 Database 전략 유지 | 세션 강제 무효화 기능을 살려둔다 |

"비밀번호 변경 시 세션 무효화"라는 유일한 Database 전략의 사용 목적이 이 프로젝트에 없으므로, YAGNI 원칙에 따라 A(JWT)로 결정했다.

## 변경 사항

- `src/auth.config.ts`: `session.strategy`를 `"database"` → `"jwt"`로 변경
- `callbacks.session`의 시그니처가 Database 방식(`{ session, user }`)에서 JWT 방식(`{ session, token }`)으로 바뀌어야 해서, `callbacks.jwt`를 새로 추가해 로그인 시 `user.id`/`user.role`을 토큰에 담고, `session` 콜백에서는 그 토큰 값을 세션에 옮기는 구조로 수정
- `src/types/next-auth.d.ts`: `next-auth/jwt` 모듈의 `JWT` 인터페이스에 `id`, `role` 필드를 추가로 선언 (JWT 전략에서 커스텀 필드를 타입 안전하게 쓰려면 필수)
- Prisma 스키마: `Session`, `VerificationToken` 모델 제거 상태 유지 (이미 제거됨)

## 배운 점

- 세션 전략(JWT vs Database)의 선택 기준은 결국 "서버가 개별 세션을 즉시 끊어야 하는 기능이 있는가"로 좁혀진다. 그 기능(비밀번호 변경, 강제 로그아웃 등)이 없다면 JWT가 더 단순하고, DB 테이블 하나(`Session`)를 유지/관리할 이유도 없어진다.
- 인증 전략은 한 번 정하고 끝나는 게 아니라, 스키마의 다른 부분(이번엔 "비밀번호 변경 기능 유무")이 바뀌면 그 근거도 다시 따져봐야 한다. 이번엔 반대 방향(Database → JWT)으로 다시 바뀐 사례.
