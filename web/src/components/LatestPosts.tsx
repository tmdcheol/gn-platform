import Link from "next/link";
import { Suspense } from "react";

import DataError from "@/components/DataError";
import Icon from "@/components/Icon";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/data";

const LATEST_COUNT = 3;
const GRID_CLASS = "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3";

export default function LatestPosts() {
  return (
    <section className="border-t border-border">
      <div className="wrap section-y">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">정비 이야기</span>
            <h2 className="headline mt-3 max-w-[20ch]">
              현장에서 자주 만나는 증상들
            </h2>
          </div>
          <Link href="/blog" className="btn btn-outline">
            전체 보기
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <Suspense fallback={<PostGridSkeleton />}>
          <PostGrid />
        </Suspense>
      </div>
    </section>
  );
}

/**
 * 발행하면 관리자 화면이 posts 태그를 무효화하므로(T-38) 캐시본으로도 즉시 반영됩니다.
 * 목록은 최신순으로 오므로 앞 3건을 자릅니다 — API 페이지네이션은 T-39입니다.
 */
async function PostGrid() {
  const posts = await getPosts();

  if (posts === null) {
    return <DataError>글 목록을 불러오지 못했습니다.</DataError>;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <ul className={GRID_CLASS}>
      {posts.slice(0, LATEST_COUNT).map((post) => (
        <li key={post.id}>
          <PostCard post={post} headingLevel="h3" />
        </li>
      ))}
    </ul>
  );
}

function PostGridSkeleton() {
  return (
    <ul className={GRID_CLASS} aria-hidden>
      {Array.from({ length: LATEST_COUNT }, (_, i) => (
        <li key={i} className="card animate-pulse p-6">
          <div className="h-6 w-2/3 rounded bg-surface-2" />
          <div className="mt-3 h-4 w-full rounded bg-surface-2" />
          <div className="mt-2 h-4 w-4/5 rounded bg-surface-2" />
          <div className="mt-6 h-4 w-24 rounded bg-surface-2" />
        </li>
      ))}
    </ul>
  );
}
