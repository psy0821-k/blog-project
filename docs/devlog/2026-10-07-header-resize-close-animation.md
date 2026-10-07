---
title: 헤더 오프캔버스 메뉴 — 데스크탑에서 모바일로 리사이즈 시 닫힘 애니메이션이 보이는 문제
date: 2026-10-07
tags: [nextjs, tailwind, header, offcanvas, transition, troubleshooting]
---

## 배경

헤더 메뉴를 오프캔버스로 구현하면서, 작은 화면에서 큰 화면으로 이동하면 메뉴가 자동으로 닫히도록 `resize` 이벤트로 처리했다. 이 과정에서 데스크탑/모바일로 나뉘어 있던 nav 영역(관리자 인사말·로그아웃)도 하나로 통합했다.

## 문제

데스크탑 너비에서 모바일 너비로 창을 줄이면 **메뉴가 닫히는 애니메이션이 화면에 보인다.**

## 원인

- 데스크탑에서는 메뉴가 `flex`로 가로 배치된 `static` 상태이고, 모바일에서는 `fixed` + `translate-x-full`(화면 밖) 상태다.
- 너비가 모바일로 바뀌는 순간 메뉴가 세로로 세워지면서 닫힘 위치(`translate-x-full`)로 이동하는데, 이 이동에 `transition-transform`이 적용되어 눈에 보이는 슬라이드 아웃 애니메이션이 된다.

## 해결

리사이징 중에는 transition이 동작하지 않도록 `isResizing` 상태를 두었다.

- `resize` 이벤트가 발생하면 `isResizing`을 `true`로 바꿔 `transition-none`을 적용한다.
- 마지막 `resize` 이벤트 150ms 뒤에 `false`로 되돌려 햄버거 버튼 토글의 애니메이션은 그대로 유지한다.
- 이벤트마다 이전 타이머를 `clearTimeout`으로 정리하고, 언마운트 시에도 타이머와 리스너를 해제해 불필요한 타이머가 남지 않게 했다.

```tsx
useEffect(() => {
  let timerId: number

  const handleResize = () => {
    setIsResizing(true)

    if (window.innerWidth >= 640) {
      setIsMenuOpen(false)
    }

    window.clearTimeout(timerId)
    timerId = window.setTimeout(() => setIsResizing(false), 150)
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.clearTimeout(timerId)
    window.removeEventListener('resize', handleResize)
  }
}, [])
```

```tsx
${isResizing ? 'transition-none' : 'transition-transform duration-300'}
```

## 참고

- 수정 파일: `src/components/common/Header.tsx`
