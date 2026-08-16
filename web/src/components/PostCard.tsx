import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/date";
import type { Post } from "@/lib/types";

/**
 * 블로그 목록과 메인의 최신 글이 같은 카드를 씁니다.
 * 제목 태그는 놓이는 자리에 따라 다릅니다 — /blog는 h1 바로 아래라 h2,
 * 메인은 섹션 제목(h2)의 하위라 h3입니다.
 */
export default function PostCard({
  post,
  headingLevel = "h2",
}: {
  post: Post;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

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
        <Heading className="text-lg font-bold tracking-tight">
          {post.title}
        </Heading>
        <p className="mt-2 line-clamp-3 text-muted">{post.excerpt}</p>
        {/* mt-auto: 제목이 두 줄인 카드가 섞여도 날짜가 카드 바닥에 붙어 행끼리 정렬됩니다. */}
        <time
          dateTime={post.createdAt}
          className="mt-auto pt-4 text-sm text-muted"
        >
          {formatDate(post.createdAt)}
        </time>
      </div>
    </Link>
  );
}
