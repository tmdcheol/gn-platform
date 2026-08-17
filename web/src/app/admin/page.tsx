"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { formatDate } from "@/lib/date";
import { ApiError, apiFetchWithSession } from "@/lib/api";
import { revalidatePostsQuietly } from "@/lib/revalidate";
import type { Post } from "@/lib/types";

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 세션이 없거나 만료된 401만 여기서 처리합니다.
   * 그 밖의 실패는 무엇을 하다 실패했는지에 따라 문구가 달라야 해서 호출부에 맡깁니다.
   */
  const redirectIfUnauthorized = useCallback(
    (cause: unknown) => {
      const unauthorized = cause instanceof ApiError && cause.status === 401;
      if (unauthorized) {
        router.replace("/admin/login");
      }
      return unauthorized;
    },
    [router],
  );

  useEffect(() => {
    apiFetchWithSession<Post[]>("/api/admin/posts")
      .then(setPosts)
      .catch((cause) => {
        if (!redirectIfUnauthorized(cause)) {
          setError("글 목록을 불러오지 못했습니다.");
        }
      });
  }, [redirectIfUnauthorized]);

  async function handleDelete(id: number) {
    setError(null);
    try {
      await apiFetchWithSession(`/api/admin/posts/${id}`, { method: "DELETE" });
      setPosts((current) => current?.filter((post) => post.id !== id) ?? null);
      await revalidatePostsQuietly();
    } catch (cause) {
      if (!redirectIfUnauthorized(cause)) {
        setError("글을 삭제하지 못했습니다. 목록은 그대로입니다.");
      }
    }
  }

  return (
    <div className="wrap section-y">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">관리자</span>
          <h1 className="headline mt-3">글 목록</h1>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          새 글
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-12 text-danger">
          {error}
        </p>
      )}

      {!posts && !error && <ListSkeleton />}

      {posts && posts.length === 0 && (
        <p role="status" className="mt-12 text-muted">
          아직 등록된 글이 없습니다.
        </p>
      )}

      {posts && posts.length > 0 && (
        <ul className="mt-10 grid gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="card flex flex-wrap items-center gap-x-4 gap-y-3 p-5"
            >
              <PublishBadge published={post.published} />
              <span className="min-w-0 flex-1 font-semibold">{post.title}</span>
              <time
                dateTime={post.createdAt}
                className="text-sm tabular-nums text-muted"
              >
                {formatDate(post.createdAt)}
              </time>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-surface-2"
                >
                  수정
                </Link>
                <DeleteButton onDelete={() => handleDelete(post.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 목록을 받아오기 전 자리. 로그아웃 상태로 들어와 리다이렉트되기 직전에도 이 화면입니다. */
function ListSkeleton() {
  return (
    <ul className="mt-10 grid gap-3" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="card flex animate-pulse items-center gap-4 p-5">
          <div className="h-6 w-12 rounded-full bg-surface-2" />
          <div className="h-5 flex-1 rounded bg-surface-2" />
          <div className="h-5 w-24 rounded bg-surface-2" />
        </li>
      ))}
    </ul>
  );
}

function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        published ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted"
      }`}
    >
      {published ? "발행" : "임시"}
    </span>
  );
}

/**
 * 되돌릴 수 없는 동작이라 한 번 더 묻습니다.
 * window.confirm 대신 인라인 확인을 쓰면 브라우저 모달 없이 같은 효과를 냅니다.
 */
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-muted hover:bg-surface-2"
      >
        삭제
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="text-muted">삭제할까요?</span>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg px-2.5 py-1.5 font-bold text-danger hover:bg-surface-2"
      >
        삭제
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-2.5 py-1.5 font-semibold hover:bg-surface-2"
      >
        취소
      </button>
    </span>
  );
}
