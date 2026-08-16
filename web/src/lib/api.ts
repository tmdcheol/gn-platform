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

const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";

function readCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

/**
 * CSRF 토큰 쿠키는 API를 한 번이라도 호출해야 생깁니다.
 * 공개 화면은 서버에서 fetch하므로 브라우저에는 쿠키가 없을 수 있어, 로그인 직전에 받아옵니다.
 */
async function primeCsrfToken() {
  // 비로그인 상태에서는 401이지만 응답 헤더로 쿠키는 내려옵니다.
  await fetch(`${baseUrl()}/api/auth/me`, { credentials: "include" });
  return readCookie(CSRF_COOKIE);
}

/**
 * 브라우저에서 호출하는 관리자용 API. 공개 화면의 서버 fetch와 두 가지가 다릅니다.
 * - `credentials: 'include'`가 없으면 오리진이 달라 세션 쿠키가 저장·전송되지 않습니다.
 * - 쓰기 요청은 CSRF 토큰을 헤더에 실어야 403이 나지 않습니다.
 */
export async function apiFetchWithSession<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = readCookie(CSRF_COOKIE) ?? (await primeCsrfToken());

  return apiFetch<T>(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(token ? { [CSRF_HEADER]: token } : {}),
      ...init?.headers,
    },
  });
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
