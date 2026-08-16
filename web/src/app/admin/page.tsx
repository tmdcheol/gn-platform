"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiFetchWithSession } from "@/lib/api";

/**
 * 로그인 후 도착하는 화면. 글 목록은 T-34에서 채웁니다.
 * 여기서는 세션이 살아 있는지(새로고침해도 유지되는지)만 확인합니다.
 */
export default function AdminHomePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    apiFetchWithSession<{ username: string }>("/api/auth/me")
      .then((me) => setUsername(me.username))
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  if (!username) {
    return null;
  }

  return (
    <div className="wrap section-y">
      <span className="eyebrow">관리자</span>
      <h1 className="headline mt-3">{username}님, 로그인되어 있습니다</h1>
      <p className="lead mt-5">글 목록은 준비 중입니다.</p>
    </div>
  );
}
