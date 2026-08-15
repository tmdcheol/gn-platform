import Image from "next/image";
import Link from "next/link";

import DataError from "@/components/DataError";
import { formatDate } from "@/lib/date";
import { getPosts } from "@/lib/data";
import type { Post } from "@/lib/types";

// 데스크톱 3열 / 모바일 1열.
const GRID_CLASS = "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3";

/**
 * 공개 목록입니다. 글쓰기·수정·삭제 버튼을 두지 않습니다 — 작성은 /admin에서만.
 * 크롤러에 내용이 실려야 하므로 서버 컴포넌트에서 await로 가져옵니다.
 */
export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="wrap section-y">
      <span className="eyebrow">블로그</span>
      <h1 className="headline mt-3 max-w-[20ch]">
        특장차 정비 이야기와 수리 사례
      </h1>
      <p className="lead mt-5 max-w-lg">
        현장에서 자주 만나는 증상과 점검 방법을 정리했습니다.
      </p>

      {posts === null ? (
        <DataError>글 목록을 불러오지 못했습니다.</DataError>
      ) : posts.length === 0 ? (
        <p role="status" className="mt-12 text-muted">
          아직 등록된 글이 없습니다.
        </p>
      ) : (
        <ul className={GRID_CLASS}>
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card card-hover flex h-full flex-col overflow-hidden"
    >
      {/* 썸네일이 없으면 빈 회색 박스가 남지 않도록 영역째 렌더하지 않습니다. */}
      {post.thumbnailUrl ? (
        <div className="relative aspect-video bg-surface-2">
          <Image
            src={post.thumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-lg font-bold tracking-tight">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-muted">{post.excerpt}</p>
        <time dateTime={post.createdAt} className="mt-4 text-sm text-muted">
          {formatDate(post.createdAt)}
        </time>
      </div>
    </Link>
  );
}
