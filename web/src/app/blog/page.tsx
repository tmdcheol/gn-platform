import type { Metadata } from "next";

import DataError from "@/components/DataError";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import PostSearch from "@/components/PostSearch";
import { getPostPage } from "@/lib/data";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/site";

const DESCRIPTION =
  "탑차·윙바디·냉동탑·리프트에서 자주 나오는 증상과 점검 방법을 정비 현장 기준으로 정리했습니다.";

export const metadata: Metadata = {
  title: "특장차 정비 이야기와 수리 사례",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    title: "특장차 정비 이야기와 수리 사례 | GN특장",
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
  },
};

// 데스크톱 3열 / 모바일 1열.
const GRID_CLASS = "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3";

/** ?page=는 사람이 읽는 1부터, API는 0부터입니다. 숫자가 아니거나 1보다 작으면 1페이지로 봅니다. */
function pageNumber(value: string | string[] | undefined) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(parsed) && parsed > 1 ? parsed : 1;
}

function searchQuery(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : (value ?? "")).trim();
}

/**
 * 공개 목록입니다. 글쓰기·수정·삭제 버튼을 두지 않습니다 — 작성은 /admin에서만.
 * 크롤러에 내용이 실려야 하므로 서버 컴포넌트에서 await로 가져옵니다.
 *
 * 검색어·페이지는 클라이언트 상태가 아니라 searchParams로 받습니다.
 * 그래야 검색 결과와 2페이지도 서버 렌더되고, 새로고침·뒤로가기가 그대로 살아납니다.
 */
export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const params = await searchParams;
  const q = searchQuery(params.q);
  const page = pageNumber(params.page);
  const result = await getPostPage(page - 1, q);

  return (
    <div className="wrap section-y">
      <span className="eyebrow">블로그</span>
      <h1 className="headline mt-3 max-w-[20ch]">
        특장차 정비 이야기와 수리 사례
      </h1>
      <p className="lead mt-5 max-w-lg">
        현장에서 자주 만나는 증상과 점검 방법을 정리했습니다.
      </p>

      <PostSearch q={q} />

      {result === null ? (
        <DataError>글 목록을 불러오지 못했습니다.</DataError>
      ) : result.content.length === 0 ? (
        <p role="status" className="mt-12 text-muted">
          {q
            ? `'${q}'에 대한 검색 결과가 없습니다.`
            : "아직 등록된 글이 없습니다."}
        </p>
      ) : (
        <>
          {q && (
            <p role="status" className="mt-8 text-muted">
              &apos;{q}&apos; 검색 결과 {result.totalElements}건
            </p>
          )}
          <ul className={GRID_CLASS}>
            {result.content.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={result.totalPages} q={q} />
        </>
      )}
    </div>
  );
}
