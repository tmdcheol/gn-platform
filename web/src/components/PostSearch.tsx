import Form from "next/form";

/**
 * 검색어는 URL 쿼리스트링으로만 관리합니다 — 검색 결과 페이지도 서버에서 렌더돼야 하기 때문입니다.
 * next/form은 제출하면 ?q=를 붙여 클라이언트 내비게이션하고, JS가 없으면 평범한 GET 폼으로 동작합니다.
 */
export default function PostSearch({ q }: { q: string }) {
  return (
    <Form action="/blog" className="mt-10 flex max-w-md items-center gap-3">
      {/* page는 넘기지 않습니다 — 검색어가 바뀌면 첫 페이지부터 봐야 합니다. */}
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="증상·차종으로 검색"
        aria-label="글 검색"
        className="field min-w-0 flex-1"
      />
      <button type="submit" className="btn btn-outline h-12 px-6">
        검색
      </button>
    </Form>
  );
}
