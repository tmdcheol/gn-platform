"use client";

import Image from "next/image";
import { useId, useState } from "react";

import ImageUploader from "@/components/ImageUploader";
import Markdown from "@/components/Markdown";
import { ApiError } from "@/lib/api";
import type { Post } from "@/lib/types";

export type PostFormValues = {
  title: string;
  author: string;
  excerpt: string | null;
  content: string;
  thumbnailUrl: string | null;
  published: boolean;
};

/**
 * 작성(T-35)과 수정(T-37)이 같은 폼을 씁니다.
 * 저장 후 어디로 갈지는 쓰는 쪽이 정하고, 여기서는 입력과 실패 문구만 다룹니다.
 */
export default function PostForm({
  initial,
  slug,
  submitLabel,
  onSubmit,
  onUnauthorized,
  actions,
}: {
  initial?: Post;
  /** 수정 화면에서만 넘깁니다. 슬러그는 한 번 정해지면 바뀌지 않습니다. */
  slug?: string;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
  onUnauthorized: () => void;
  /** 삭제 버튼처럼 저장 버튼 옆에 붙는 것들. */
  actions?: React.ReactNode;
}) {
  const contentId = useId();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  // 자동 요약은 프리필하지 않습니다. 채워 두면 그대로 다시 저장돼 옛 본문 상태로 굳습니다.
  const [excerpt, setExcerpt] = useState(
    initial && !initial.excerptAuto ? initial.excerpt : "",
  );
  const [content, setContent] = useState(initial?.content ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initial?.thumbnailUrl ?? null,
  );
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /** 업로드한 이미지를 본문 끝에 마크다운으로 붙입니다. alt는 파일명이 기본값입니다. */
  function insertImage(url: string, alt: string) {
    const image = `![${alt}](${url})`;
    setContent((current) =>
      current.trim() === "" ? `${image}\n` : `${current.trimEnd()}\n\n${image}\n`,
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSubmit({
        title,
        author,
        // 요약을 비우면 서버가 본문에서 만들어 줍니다(T-20). 빈 문자열이 아니라 null로 보냅니다.
        excerpt: excerpt.trim() === "" ? null : excerpt,
        content,
        thumbnailUrl,
        published,
      });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        onUnauthorized();
        return;
      }
      setError(
        cause instanceof ApiError && cause.status === 400
          ? "입력값을 확인해 주세요. 제목·작성자·본문은 필수이고, 제목은 200자·요약은 300자까지입니다."
          : "저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={200}
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

      {slug && (
        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            주소(슬러그){" "}
            <span className="font-normal text-muted">
              제목을 바꿔도 그대로입니다 — 주소가 바뀌면 그동안의 검색 색인이
              날아갑니다
            </span>
          </span>
          <input value={`/blog/${slug}`} readOnly className="field text-muted" />
        </label>
      )}

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

      <div className="grid gap-2">
        <span className="text-sm font-semibold">
          썸네일{" "}
          <span className="font-normal text-muted">
            목록 카드와 공유 미리보기에 쓰입니다
          </span>
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <ImageUploader
            label="이미지 업로드"
            onUploaded={(url) => setThumbnailUrl(url)}
            onUnauthorized={onUnauthorized}
          />
          {thumbnailUrl && (
            <>
              <div className="relative h-20 w-32 overflow-hidden rounded-xl bg-surface-2">
                <Image
                  src={thumbnailUrl}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setThumbnailUrl(null)}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-muted hover:bg-surface-2"
              >
                썸네일 제거
              </button>
            </>
          )}
        </div>
      </div>

      {/* 왼쪽에 마크다운 원문, 오른쪽에 공개 화면과 같은 렌더 결과(T-27). */}
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {/* label 안에 label을 넣을 수 없어 헤더와 입력칸을 나눠 둡니다. */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor={contentId} className="text-sm font-semibold">
              본문 (마크다운)
            </label>
            <ImageUploader
              label="본문에 이미지 삽입"
              onUploaded={insertImage}
              onUnauthorized={onUnauthorized}
            />
          </div>
          <textarea
            id={contentId}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={20}
            className="field h-auto py-3 font-mono text-sm leading-relaxed"
          />
        </div>

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

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary disabled:opacity-60"
        >
          {saving ? "저장 중…" : submitLabel}
        </button>
        {actions}
      </div>
    </form>
  );
}
