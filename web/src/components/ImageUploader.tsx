"use client";

import { useId, useState } from "react";

import { ApiError, apiFetchWithSession } from "@/lib/api";

/**
 * 파일명에서 확장자를 뗀 값. 대체 텍스트 입력칸을 따로 두는 대신 여기서 기본값을 만들고,
 * 관리자가 본문에서 고치게 합니다. 빈 alt는 이미지 검색 유입과 스크린리더 양쪽을 잃습니다.
 */
function altFromFilename(filename: string) {
  return filename.replace(/\.[^.]+$/, "").trim();
}

/**
 * 관리자 폼의 이미지 업로드 버튼. 올린 뒤 무엇을 할지는 쓰는 쪽이 정합니다
 * (썸네일 필드에 채우거나 본문에 마크다운으로 삽입).
 */
export default function ImageUploader({
  label,
  onUploaded,
  onUnauthorized,
}: {
  label: string;
  onUploaded: (url: string, alt: string) => void;
  onUnauthorized: () => void;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { url } = await apiFetchWithSession<{ url: string }>(
        "/api/admin/images",
        { method: "POST", body: formData },
      );
      onUploaded(url, altFromFilename(file.name));
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        onUnauthorized();
        return;
      }
      setError(
        cause instanceof ApiError && cause.status === 400
          ? "jpg·png·webp·gif 파일만, 5MB까지 올릴 수 있습니다."
          : "업로드하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setUploading(false);
      // 같은 파일을 다시 고를 수 있도록 비웁니다.
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label
        htmlFor={inputId}
        className="btn btn-outline h-11 cursor-pointer px-4 text-sm"
      >
        {uploading ? "올리는 중…" : label}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        disabled={uploading}
        className="sr-only"
      />
      {error && (
        <span role="alert" className="text-sm font-medium text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
