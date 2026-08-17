import { ApiError, apiFetch } from "@/lib/api";
import type { Contact, Post, RepairService, Review } from "@/lib/types";

/**
 * 화면용 조회 함수. 실패를 예외로 던지지 않고 null로 돌려주므로,
 * 컴포넌트마다 try/catch를 반복하지 않고 `null이면 안내 문구`만 다루면 됩니다.
 * (API가 죽어도 페이지 전체가 죽지 않아야 합니다.)
 */
/**
 * 연락처·서비스·후기는 자주 바뀌지 않으므로 60초 캐시합니다.
 * 덕분에 랜딩이 정적으로 미리 렌더되고(콜드 스타트 체감 감소), 값이 바뀌면
 * 최대 60초 뒤에 반영됩니다. 항상 최신이어야 하는 목록은 이 값을 넘기지 마세요.
 */
const CONTENT_REVALIDATE_SECONDS = 60;

async function readOrNull<T>(
  path: string,
  cache: RequestInit & { revalidate?: number; tags?: string[] } = {
    revalidate: CONTENT_REVALIDATE_SECONDS,
  },
): Promise<T | null> {
  try {
    return await apiFetch<T>(path, cache);
  } catch (error) {
    console.error(`[api] ${path} 조회 실패`, error);
    return null;
  }
}

export function getContact() {
  return readOrNull<Contact>("/api/contact");
}

export function getServices() {
  return readOrNull<RepairService[]>("/api/services");
}

/**
 * 서비스 상세. 없는 슬러그는 "not-found", API 장애는 null로 구분합니다(getPost와 같은 규칙).
 */
export async function getService(
  slug: string,
): Promise<RepairService | "not-found" | null> {
  try {
    return await apiFetch<RepairService>(`/api/services/${slug}`, {
      revalidate: CONTENT_REVALIDATE_SECONDS,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return "not-found";
    }
    console.error(`[api] /api/services/${slug} 조회 실패`, error);
    return null;
  }
}

export function getReviews() {
  return readOrNull<Review[]>("/api/reviews");
}

/**
 * 글 캐시 태그. 관리자가 저장·삭제하면 이 태그를 무효화해 목록·상세를 한 번에 새로 굽습니다(T-38).
 * 시간 만료는 보험일 뿐이라 길게 둡니다 — 발행 반영은 태그 무효화가 책임집니다.
 */
export const POSTS_TAG = "posts";
const POSTS_REVALIDATE_SECONDS = 3600;

/** 관련 글·최신 글처럼 목록을 통째로 훑는 자리에서 한 번에 받는 크기. */
const POSTS_PAGE_SIZE = 100;

/** /blog 한 페이지에 보이는 글 수. */
const BLOG_PAGE_SIZE = 6;

export type PostPage = {
  content: Post[];
  totalPages: number;
  totalElements: number;
};

function readPostPage(page: number, size: number, q = "") {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  if (q) {
    query.set("q", q);
  }

  // 검색 결과는 캐시하지 않습니다 — 검색어마다 별도 엔트리라, 봇이 아무 말이나 긁으면
  // 데이터 캐시가 계속 불어납니다. 목록·상세만 태그 캐시로 굽습니다.
  return readOrNull<PostPage>(
    `/api/posts?${query}`,
    q
      ? { cache: "no-store" }
      : { revalidate: POSTS_REVALIDATE_SECONDS, tags: [POSTS_TAG] },
  );
}

/**
 * 글 목록 첫 페이지. 태그 캐시라 정적으로 구워지고, 발행하면 무효화로 즉시 갈립니다.
 *
 * 사이트맵처럼 전체가 필요한 곳은 getAllPosts를,
 * /blog처럼 페이지·검색이 필요한 곳은 getPostPage를 쓰세요.
 */
export async function getPosts(): Promise<Post[] | null> {
  const page = await readPostPage(0, POSTS_PAGE_SIZE);
  return page?.content ?? null;
}

/**
 * /blog용 한 페이지. page는 0부터, q가 있으면 제목·본문 검색입니다(T-40).
 * 총 페이지 수가 필요하므로 글 목록이 아니라 페이지 객체를 그대로 돌려줍니다.
 */
export function getPostPage(page: number, q = ""): Promise<PostPage | null> {
  return readPostPage(page, BLOG_PAGE_SIZE, q);
}

/**
 * 발행된 글 전체. 페이지를 끝까지 따라갑니다.
 * 사이트맵이 글 수에 따라 조용히 잘리면 그만큼 색인이 빠지므로, 상한을 두지 않습니다.
 */
export async function getAllPosts(): Promise<Post[] | null> {
  const first = await readPostPage(0, POSTS_PAGE_SIZE);
  if (!first) {
    return null;
  }

  const rest = await Promise.all(
    Array.from({ length: Math.max(first.totalPages - 1, 0) }, (_, index) =>
      readPostPage(index + 1, POSTS_PAGE_SIZE),
    ),
  );

  // 뒤 페이지 하나가 실패해도 사이트맵 전체를 버리지는 않습니다 — 받은 만큼은 남깁니다.
  return [...first.content, ...rest.flatMap((page) => page?.content ?? [])];
}

/**
 * 슬러그는 한글이라 URL에서 퍼센트 인코딩됩니다.
 * params가 이미 인코딩된 값을 주는 경우가 있어, 그대로 다시 인코딩하면 %EB가 %25EB가 됩니다.
 * 한 번 디코딩해 원문으로 되돌린 뒤 인코딩합니다.
 */
function encodeSlug(slug: string) {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // 디코딩할 수 없는 문자열이면 원본을 그대로 씁니다.
  }
  return encodeURIComponent(decoded);
}

/**
 * 글 상세. 세 가지 결과를 구분합니다.
 * - Post: 발행된 글
 * - "not-found": 없는 슬러그이거나 임시저장 글 → 404 화면
 * - null: API 장애 → 404가 아니라 오류 안내 (없는 글로 오인해 색인이 빠지면 안 됩니다)
 */
export async function getPost(slug: string): Promise<Post | "not-found" | null> {
  try {
    return await apiFetch<Post>(`/api/posts/${encodeSlug(slug)}`, {
      revalidate: POSTS_REVALIDATE_SECONDS,
      tags: [POSTS_TAG],
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return "not-found";
    }
    console.error(`[api] /api/posts/${slug} 조회 실패`, error);
    return null;
  }
}
