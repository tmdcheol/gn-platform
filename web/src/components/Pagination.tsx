import Link from "next/link";

/** 현재 페이지 앞뒤로 보여 줄 번호 수. 글이 많아져도 버튼 줄이 늘어나지 않게 합니다. */
const AROUND = 2;

/** 페이지·검색어를 URL에 그대로 담습니다. 1페이지는 ?page=1을 붙이지 않아 /blog와 같은 주소가 됩니다. */
export function blogHref(page: number, q: string) {
  const query = new URLSearchParams();
  if (q) {
    query.set("q", q);
  }
  if (page > 1) {
    query.set("page", String(page));
  }
  const search = query.toString();
  return search ? `/blog?${search}` : "/blog";
}

const LINK_CLASS =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-border px-3 text-sm";

export default function Pagination({
  page,
  totalPages,
  q,
}: {
  page: number;
  totalPages: number;
  q: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const first = Math.max(1, Math.min(page - AROUND, totalPages - AROUND * 2));
  const last = Math.min(totalPages, first + AROUND * 2);
  const numbers = Array.from({ length: last - first + 1 }, (_, i) => first + i);

  return (
    <nav aria-label="글 목록 페이지" className="mt-12 flex flex-wrap justify-center gap-2">
      {page > 1 && (
        <Link href={blogHref(page - 1, q)} className={LINK_CLASS}>
          이전
        </Link>
      )}

      {numbers.map((number) =>
        number === page ? (
          <span
            key={number}
            aria-current="page"
            className={`${LINK_CLASS} border-transparent bg-brand font-bold text-brand-contrast`}
          >
            {number}
          </span>
        ) : (
          <Link
            key={number}
            href={blogHref(number, q)}
            aria-label={`${number}페이지`}
            className={LINK_CLASS}
          >
            {number}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link href={blogHref(page + 1, q)} className={LINK_CLASS}>
          다음
        </Link>
      )}
    </nav>
  );
}
