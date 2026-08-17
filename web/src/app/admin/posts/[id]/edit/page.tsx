"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

import PostForm, { type PostFormValues } from "@/components/PostForm";
import { ApiError, apiFetchWithSession } from "@/lib/api";
import { revalidatePostsQuietly } from "@/lib/revalidate";
import type { Post } from "@/lib/types";

export default function EditPostPage({
  params,
}: PageProps<"/admin/posts/[id]/edit">) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  const goToLogin = useCallback(() => {
    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    apiFetchWithSession<Post>(`/api/admin/posts/${id}`)
      .then(setPost)
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 401) {
          goToLogin();
          return;
        }
        setError(
          cause instanceof ApiError && cause.status === 404
            ? "없는 글입니다."
            : "글을 불러오지 못했습니다.",
        );
      });
  }, [id, goToLogin]);

  async function handleSubmit(values: PostFormValues) {
    // 슬러그는 서버가 지킵니다. 제목을 바꿔도 주소는 그대로입니다(T-19).
    await apiFetchWithSession(`/api/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    await revalidatePostsQuietly();
    router.replace("/admin");
  }

  return (
    <div className="wrap section-y">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">관리자</span>
          <h1 className="headline mt-3">글 수정</h1>
        </div>
        <Link href="/admin" className="btn btn-outline">
          목록으로
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-12 text-danger">
          {error}
        </p>
      )}

      {!post && !error && <FormSkeleton />}

      {post && (
        <PostForm
          initial={post}
          slug={post.slug}
          submitLabel="수정 저장"
          onSubmit={handleSubmit}
          onUnauthorized={goToLogin}
          actions={<DeleteButton id={id} onUnauthorized={goToLogin} />}
        />
      )}
    </div>
  );
}

/**
 * 되돌릴 수 없으므로 한 번 더 묻고 지웁니다.
 * 브라우저 confirm 대신 인라인 확인을 쓰는 건 관리자 목록(T-34)과 같은 방식입니다.
 */
function DeleteButton({
  id,
  onUnauthorized,
}: {
  id: string;
  onUnauthorized: () => void;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    try {
      await apiFetchWithSession(`/api/admin/posts/${id}`, { method: "DELETE" });
      await revalidatePostsQuietly();
      router.replace("/admin");
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        onUnauthorized();
        return;
      }
      setError("삭제하지 못했습니다. 글은 그대로입니다.");
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-surface-2"
        >
          삭제
        </button>
        {error && (
          <span role="alert" className="text-sm font-medium text-danger">
            {error}
          </span>
        )}
      </>
    );
  }

  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="text-muted">이 글을 삭제할까요?</span>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-lg px-3 py-2 font-bold text-danger hover:bg-surface-2"
      >
        삭제
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-3 py-2 font-semibold hover:bg-surface-2"
      >
        취소
      </button>
    </span>
  );
}

function FormSkeleton() {
  return (
    <div className="mt-10 grid gap-5" aria-hidden>
      <div className="h-12 animate-pulse rounded-xl bg-surface-2" />
      <div className="h-12 animate-pulse rounded-xl bg-surface-2" />
      <div className="h-80 animate-pulse rounded-xl bg-surface-2" />
    </div>
  );
}
