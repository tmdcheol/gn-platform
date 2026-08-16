"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiError, apiFetchWithSession } from "@/lib/api";

const INVALID_CREDENTIALS = "아이디 또는 비밀번호가 올바르지 않습니다";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await apiFetchWithSession("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      router.replace("/admin");
    } catch (cause) {
      // 401은 자격 증명이 틀린 경우, 그 밖은 서버·네트워크 문제입니다.
      setError(
        cause instanceof ApiError && cause.status === 401
          ? INVALID_CREDENTIALS
          : "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap section-y">
      <div className="card mx-auto max-w-sm p-8">
        <h1 className="text-2xl font-bold tracking-tight">관리자 로그인</h1>
        <p className="mt-2 text-sm text-muted">글 작성은 관리자만 가능합니다.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">아이디</span>
            <input
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="field"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">비밀번호</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="field"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary mt-2 w-full disabled:opacity-60"
          >
            {submitting ? "확인 중…" : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
