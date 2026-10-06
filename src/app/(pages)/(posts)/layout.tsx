// Projects/Lab 목록·상세가 공유하는 본문 영역. Header는 루트 레이아웃에서 이미 렌더링하므로 여기서 다시 두지 않는다.
// 서브메뉴(카테고리)는 1440px 이상에서 왼쪽 사이드바, 그 미만에서는 목록 위 가로 스크롤 줄로 배치한다.
// TODO: 영역 표기용 placeholder. 카테고리 구현 시 실제 메뉴 컴포넌트로 교체한다.
export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="content min-[1440px]:grid min-[1440px]:grid-cols-[220px_1fr] min-[1440px]:gap-8">
      <nav
        aria-label="서브 메뉴"
        className="flex gap-2 overflow-x-auto px-4 py-3 md:px-0 min-[1440px]:flex-col min-[1440px]:overflow-visible"
      >
        <div className="shrink-0 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-400">
          서브메뉴 영역
        </div>
      </nav>
      <div>{children}</div>
    </main>
  )
}
