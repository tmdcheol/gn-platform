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

async function readOrNull<T>(path: string): Promise<T | null> {
  try {
    return await apiFetch<T>(path, {
      revalidate: CONTENT_REVALIDATE_SECONDS,
    });
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
 * 다른 페이지에 곁들이는 글 목록(관련 글 등)은 60초 캐시본을 씁니다.
 * 이 페이지들은 미리 생성해 두는 편이 이득이고, 새 글이 1분 늦게 붙어도 문제가 없습니다.
 */
export function getCachedPosts() {
  return readOrNull<Post[]>("/api/posts");
}

/**
 * 글 목록은 관리자가 발행하면 바로 보여야 하므로 캐시하지 않습니다.
 * no-store를 명시해야 빌드 시점에 정적으로 구워지지 않습니다 — 구워지면 발행이 늦게 반영되고,
 * 빌드할 때 API가 꺼져 있으면 에러 화면이 그대로 박힙니다.
 */
export async function getPosts(): Promise<Post[] | null> {
  try {
    return await apiFetch<Post[]>("/api/posts", { cache: "no-store" });
  } catch (error) {
    console.error("[api] /api/posts 조회 실패", error);
    return null;
  }
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
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return "not-found";
    }
    console.error(`[api] /api/posts/${slug} 조회 실패`, error);
    return null;
  }
}
