import { apiFetch } from "@/lib/api";
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

export function getReviews() {
  return readOrNull<Review[]>("/api/reviews");
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
