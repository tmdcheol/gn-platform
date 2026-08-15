import Link from "next/link";
import { notFound } from "next/navigation";

import DataError from "@/components/DataError";
import Markdown from "@/components/Markdown";
import { formatDate } from "@/lib/date";
import { getPost } from "@/lib/data";

/**
 * 공개 상세입니다. 수정·삭제 버튼을 두지 않습니다 — 관리는 /admin에서만.
 * 임시저장 글은 API가 404를 주므로 여기서도 404 화면이 됩니다.
 */
export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (post === "not-found") {
    notFound();
  }

  if (post === null) {
    return (
      <div className="wrap section-y">
        <DataError className="mt-0">글을 불러오지 못했습니다.</DataError>
        <Link href="/blog" className="btn btn-outline mt-8">
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <article className="wrap section-y">
      <div className="mx-auto max-w-[46rem]">
        <h1 className="headline">{post.title}</h1>

        <p className="mt-5 text-sm text-muted">
          <span>{post.author}</span>
          <span aria-hidden className="mx-2">
            ·
          </span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </p>

        <hr className="mt-8 border-border" />

        <div className="article-body mt-10">
          <Markdown>{post.content}</Markdown>
        </div>

        <Link href="/blog" className="btn btn-outline mt-16">
          목록으로
        </Link>
      </div>
    </article>
  );
}
