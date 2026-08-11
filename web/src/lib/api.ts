/**
 * API 호출은 전부 이 래퍼를 거칩니다. 컴포넌트에 주소를 박지 않습니다.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.");
  }

  return url.replace(/\/$/, "");
}

/**
 * @param revalidate 초 단위 캐시 수명. 생략하면 Next 기본값(캐시하지 않음)이므로,
 *   글 목록처럼 항상 최신이어야 하는 요청은 아무것도 넘기지 않으면 됩니다.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number },
): Promise<T> {
  const { revalidate, ...requestInit } = init ?? {};

  // AbortSignal을 넘기면 Next의 fetch 메모이제이션이 꺼집니다(같은 렌더에서
  // 같은 요청이 여러 번 나감). 타임아웃 대신 메모이제이션을 택했습니다.
  const res = await fetch(`${baseUrl()}${path}`, {
    ...requestInit,
    headers: {
      ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
      ...requestInit.headers,
    },
    ...(revalidate === undefined ? {} : { next: { revalidate } }),
  });

  if (!res.ok) {
    throw new ApiError(
      res.status,
      path,
      `API ${res.status} ${res.statusText}: ${path}`,
    );
  }

  // 204 No Content(삭제 등)에는 본문이 없습니다.
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
