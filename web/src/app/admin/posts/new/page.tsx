"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import PostForm, { type PostFormValues } from "@/components/PostForm";
import { revalidatePosts } from "@/lib/actions";
import { apiFetchWithSession } from "@/lib/api";

export default function NewPostPage() {
  const router = useRouter();

  async function handleSubmit(values: PostFormValues) {
    await apiFetchWithSession("/api/admin/posts", {
      method: "POST",
      body: JSON.stringify(values),
    });
    await revalidatePosts();
    router.replace("/admin");
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

      <PostForm
        submitLabel="저장"
        onSubmit={handleSubmit}
        onUnauthorized={() => router.replace("/admin/login")}
      />
    </div>
  );
}
