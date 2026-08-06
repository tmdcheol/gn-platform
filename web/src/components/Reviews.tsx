import { Suspense } from "react";

import { apiFetch } from "@/lib/api";
import type { Review } from "@/lib/types";

// 모바일은 가로 스크롤 스냅, 데스크톱은 3열 그리드.
// -mx-5 px-5: 스크롤 영역을 섹션 패딩 밖까지 넓히되 첫/마지막 카드에 여백을 남깁니다.
const LIST_CLASS =
  "mt-12 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0";
const CARD_CLASS =
  "flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-black/10 bg-zinc-50 p-8 sm:w-[60%] md:w-auto dark:border-white/10 dark:bg-zinc-900";

export default function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        고객 후기
      </h2>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        실제로 맡기신 분들이 남긴 이야기입니다.
      </p>

      <Suspense fallback={<ReviewListSkeleton />}>
        <ReviewList />
      </Suspense>
    </section>
  );
}

async function ReviewList() {
  let reviews: Review[] | null = null;

  try {
    reviews = await apiFetch<Review[]>("/api/reviews");
  } catch {
    reviews = null;
  }

  if (!reviews) {
    return (
      <p className="mt-12 text-zinc-500">
        후기를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <ul className={LIST_CLASS}>
      {reviews.map((review, index) => (
        <li key={index} className={CARD_CLASS}>
          <p>
            <span aria-hidden>
              {Array.from({ length: 5 }, (_, star) => (
                <span
                  key={star}
                  className={
                    star < review.rating
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-zinc-300 dark:text-zinc-600"
                  }
                >
                  ★
                </span>
              ))}
            </span>
            <span className="sr-only">5점 만점에 {review.rating}점</span>
          </p>
          <p className="mt-4 flex-1 text-zinc-700 dark:text-zinc-300">
            {review.content}
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            {review.author} · {review.vehicleType}
          </p>
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
          <div className="h-5 w-24 rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-4 h-4 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-2 h-4 w-11/12 rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-6 h-4 w-1/3 rounded bg-black/10 dark:bg-white/10" />
        </li>
      ))}
    </ul>
  );
}
