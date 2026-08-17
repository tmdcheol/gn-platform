import { revalidatePosts } from "@/lib/actions";

/**
 * 캐시 무효화는 실패해도 저장·삭제 실패가 아닙니다.
 * 글은 이미 API에 반영됐고, 캐시는 늦어도 페이지 revalidate 주기에 스스로 갈립니다.
 * 그래서 예외를 밖으로 내보내지 않습니다 — 내보내면 성공한 저장이 실패로 보고되고,
 * 관리자가 저장을 다시 눌러 같은 글이 하나 더 생깁니다.
 */
export async function revalidatePostsQuietly() {
  try {
    await revalidatePosts();
  } catch (error) {
    console.error("[revalidate] 캐시 무효화 실패", error);
  }
}
