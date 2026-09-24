---
title: 조회수(viewCount) 증가 시 updatedAt이 함께 갱신되는 문제 — 확인만 하고 보류
date: 2026-09-25
tags: [prisma, api, viewcount, updatedat, troubleshooting]
---

## 배경

devlog/projects/lab 단건 조회(`GET /api/{type}/[slug]`) API를 만드는 과정에서, 상세 페이지 진입 시 조회수(`viewCount`)를 함께 증가시킬지 검토했다.

## 문제

Prisma 스키마의 `Post.updatedAt`은 `@updatedAt`으로 선언되어 있어, `prisma.post.update()`를 호출하면 **어떤 필드를 바꾸든 관계없이** `updatedAt`이 자동으로 현재 시각으로 갱신된다.

```prisma
updatedAt DateTime @updatedAt
```

조회수 증가를 단순히 아래처럼 구현하면:

```ts
await prisma.post.update({
  where: { id },
  data: { viewCount: { increment: 1 } },
})
```

글을 "읽기만" 한 행위가 `updatedAt`을 "방금 수정됨"으로 오염시킨다. 이는:

- 목록에서 "최근 수정순" 정렬을 쓸 경우 왜곡됨
- `updatedAt`을 "마지막 편집 시각"의 근거로 사용하는 다른 화면/로직이 있다면 그 의미가 깨짐

## 해결 방향 (아직 미적용)

Prisma의 `update()`를 거치지 않고 raw SQL로 `viewCount`만 갱신하면 `@updatedAt` 자동 갱신 로직이 아예 발동하지 않는다.

```ts
await prisma.$executeRaw`UPDATE "Post" SET "viewCount" = "viewCount" + 1 WHERE id = ${id}`
```

## 현재 상태

이번 단건 조회 API 작업 범위에서는 조회수 증가 로직 자체를 넣지 않기로 했다. 단건 조회 API는 우선 데이터만 반환하고, 조회수 증가는 별도 작업으로 분리해 위 raw SQL 방식으로 처리할 예정이다.

## 참고

- [[blog-post-query-todo]] 메모리에 있던 기존 TODO("viewCount 증가 시 updatedAt 오염 방지")와 동일한 이슈. 이 문서로 배경과 해결 방향을 구체화했다.
