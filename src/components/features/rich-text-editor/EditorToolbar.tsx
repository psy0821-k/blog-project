import { Columns2 } from 'lucide-react'
import { VIDEO_OPTIMIZATION_HINT } from '@/lib/media-validation'

interface EditorToolbarProps {
  id: string
}

/** Quill이 container 선택자로 찾아 쓰는 툴바 마크업. 동작은 modules.toolbar.handlers가 담당한다. */
const EditorToolbar = ({ id }: EditorToolbarProps) => (
  <div id={id}>
    <span className="ql-formats">
      <select className="ql-header" defaultValue="" aria-label="제목 크기">
        <option value="1">제목 1</option>
        <option value="2">제목 2</option>
        <option value="3">제목 3</option>
        <option value="">본문</option>
      </select>
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-bold" aria-label="굵게" />
      <button type="button" className="ql-italic" aria-label="기울임" />
      <button type="button" className="ql-underline" aria-label="밑줄" />
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-list" value="ordered" aria-label="번호 목록" />
      <button type="button" className="ql-list" value="bullet" aria-label="글머리 목록" />
      <button type="button" className="ql-blockquote" aria-label="인용" />
      <button type="button" className="ql-code-block" aria-label="코드 블록" />
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-align" value="" aria-label="왼쪽 정렬" />
      <button type="button" className="ql-align" value="center" aria-label="가운데 정렬" />
      <button type="button" className="ql-align" value="right" aria-label="오른쪽 정렬" />
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-link" aria-label="링크" />
      <button type="button" className="ql-image" aria-label="이미지 업로드" />
      <button
        type="button"
        className="ql-video"
        aria-label="영상 업로드"
        title={`영상 업로드 (mp4/webm, 40MB 이하) — ${VIDEO_OPTIMIZATION_HINT}`}
      />
      <button type="button" className="ql-imageGap" aria-label="이미지 가로 나열 간격">
        <Columns2 />
      </button>
      <button type="button" className="ql-youtube" aria-label="YouTube 영상 삽입">
        YT
      </button>
    </span>
  </div>
)

export default EditorToolbar
