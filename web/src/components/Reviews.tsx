import { Suspense } from "react";

import DataError from "@/components/DataError";
import { getReviews } from "@/lib/data";

// 모바일은 가로 스크롤 스냅, md 이상은 그리드.
// -mx-5 px-5: 스크롤 영역을 섹션 패딩 밖까지 넓히되 첫/마지막 카드에 여백을 남깁니다.
const LIST_CLASS =
  "mt-12 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3";
// relative: 카드 안의 sr-only(position:absolute)가 가로 스크롤 컨테이너를 빠져나가
// 페이지 전체에 가로 스크롤을 만드는 것을 막습니다.
const CARD_CLASS =
  "card relative flex w-[85%] shrink-0 snap-start flex-col p-8 sm:w-[60%] md:w-auto";

const MAX_RATING = 5;

export default function Reviews() {
  return (
    <section className="wrap section-y">
      <span className="eyebrow">고객 후기</span>
      <h2 className="headline mt-3 max-w-[18ch]">맡겨 보신 분들의 이야기</h2>
      <p className="lead mt-5 max-w-lg">수리 후 직접 남겨 주신 후기입니다.</p>

      <Suspense fallback={<ReviewListSkeleton />}>
        <ReviewList />
      </Suspense>
    </section>
  );
}

async function ReviewList() {
  const reviews = await getReviews();

  if (!reviews) {
    return <DataError>후기를 불러오지 못했습니다.</DataError>;
  }

  return (
    <ul className={LIST_CLASS}>
      {/* 응답에 id가 없어 인덱스를 키로 씁니다(정적 목록). */}
      {reviews.map((review, index) => (
        <li key={index} className={CARD_CLASS}>
          <p className="text-lg tracking-tight">
            <span aria-hidden>
              {Array.from({ length: MAX_RATING }, (_, star) => (
                <span
                  key={star}
                  className={star < review.rating ? "text-brand" : "text-border"}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="sr-only">
              {MAX_RATING}점 만점에 {review.rating}점
            </span>
          </p>

          <p className="mt-4 flex-1 text-[1.0625rem] leading-relaxed">
            {review.content}
          </p>

          <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand"
            >
              {review.author.slice(0, 1)}
            </span>
            <span className="text-sm text-muted">
              <span className="font-semibold text-foreground">
                {review.author}
              </span>
              <span className="mx-1.5">·</span>
              {review.vehicleType}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ReviewListSkeleton() {
  return (
    <ul className={LIST_CLASS} aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <li key={i} className={`${CARD_CLASS} animate-pulse`}>
          <div className="h-5 w-24 rounded bg-surface-2" />
          <div className="mt-4 h-4 w-full rounded bg-surface-2" />
          <div className="mt-2 h-4 w-11/12 rounded bg-surface-2" />
          <div className="mt-7 h-9 w-40 rounded bg-surface-2" />
        </li>
      ))}
    </ul>
  );
}
