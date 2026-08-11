"use client";

/** 렌더 중 예외가 나도 흰 화면 대신 다시 시도할 수단을 남깁니다. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="wrap section-y text-center">
      <h1 className="headline">문제가 발생했습니다</h1>
      <p className="lead mx-auto mt-4 max-w-md">
        잠시 후 다시 시도해 주세요. 급하시면 전화로 바로 상담해 드립니다.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted">오류 코드: {error.digest}</p>
      )}
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        다시 시도
      </button>
    </div>
  );
}
