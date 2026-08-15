import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import DataError from "@/components/DataError";
import Markdown from "@/components/Markdown";
import { formatDate } from "@/lib/date";
import { getPost } from "@/lib/data";
import { OPEN_GRAPH_DEFAULTS, SITE_NAME } from "@/lib/site";

/**
 * 글마다 다른 title·description·canonical·Open Graph를 만듭니다.
 * 전부 같은 값이면 12개 글이 한 제목으로 색인됩니다.
 */
export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  // 타입을 좁히기 위한 분기입니다. 페이지가 notFound()를 부르면 not-found.tsx가 렌더되고
  // 이 title은 버려집니다(404 화면 제목은 layout 기본값, noindex는 Next가 붙입니다).
  // 404 제목을 바꾸려면 여기가 아니라 not-found.tsx를 고쳐야 합니다.
  if (post === "not-found") {
    return { title: "글을 찾을 수 없습니다" };
  }

  if (post === null) {
    // 일시적인 오류 화면이 그 상태로 색인되면 안 됩니다.
    return { title: "글을 불러오지 못했습니다", robots: { index: false } };
  }

  const canonical = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      url: canonical,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      ...(post.thumbnailUrl ? { images: [post.thumbnailUrl] } : {}),
    },
  };
}

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
