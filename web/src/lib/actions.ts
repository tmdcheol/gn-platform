"use server";

import { updateTag } from "next/cache";

import { POSTS_TAG } from "@/lib/data";

/**
 * 관리자가 글을 저장·삭제한 뒤 공개 화면 캐시를 버립니다(T-38).
 * 글 쓰기는 브라우저에서 API 서버로 바로 나가므로, 웹 서버는 이렇게 알려 줘야 캐시를 압니다.
 *
 * revalidateTag가 아니라 updateTag인 이유: revalidateTag는 낡은 값을 한 번 더 내주고
 * 뒤에서 새로 굽습니다(stale-while-revalidate). 그러면 발행 직후 목록에 글이 안 보이는
 * 바로 그 상황이 남습니다. updateTag는 즉시 만료시켜 다음 요청이 새 값을 받습니다.
 */
export async function revalidatePosts() {
  updateTag(POSTS_TAG);
}
