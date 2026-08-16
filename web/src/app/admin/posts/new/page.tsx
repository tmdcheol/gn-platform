"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Markdown from "@/components/Markdown";
import { ApiError, apiFetchWithSession } from "@/lib/api";
import type { Post } from "@/lib/types";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await apiFetchWithSession<Post>("/api/admin/posts", {
        method: "POST",
        // 요약을 비우면 서버가 본문에서 만들어 줍니다(T-20). 빈 문자열이 아니라 null로 보냅니다.
        body: JSON.stringify({
          title,
          author,
          excerpt: excerpt.trim() === "" ? null : excerpt,
          content,
          published,
        }),
      });
      router.replace("/admin");
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setError(
        cause instanceof ApiError && cause.status === 400
          ? "입력값을 확인해 주세요. 제목·작성자·본문은 필수입니다."
          : "저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setSaving(false);
    }
  }

  return (
    <div className="wrap section-y">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">관리자</span>
          <h1 className="headline mt-3">새 글</h1>
        </div>
        <Link href="/admin" className="btn btn-outline">
          목록으로
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">제목</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="field"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">작성자</span>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
              className="field"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            요약{" "}
            <span className="font-normal text-muted">
              비우면 본문에서 자동으로 만듭니다
            </span>
          </span>
          <input
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            maxLength={300}
            className="field"
          />
        </label>

        {/* 왼쪽에 마크다운 원문, 오른쪽에 공개 화면과 같은 렌더 결과(T-27). */}
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">본문 (마크다운)</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              rows={20}
              className="field h-auto py-3 font-mono text-sm leading-relaxed"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">미리보기</span>
            <div className="card min-h-80 overflow-x-auto p-6">
              {content.trim() === "" ? (
                <p className="text-muted">본문을 입력하면 여기에 보입니다.</p>
              ) : (
                <div className="article-body">
                  <Markdown>{content}</Markdown>
                </div>
              )}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="h-5 w-5"
          />
          <span className="text-sm font-semibold">
            발행{" "}
            <span className="font-normal text-muted">
              끄고 저장하면 임시저장되어 블로그에 보이지 않습니다
            </span>
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary disabled:opacity-60"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
