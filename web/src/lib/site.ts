/**
 * canonical·Open Graph는 절대 URL이어야 합니다. 도메인은 여기서만 읽습니다.
 */
export function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SITE_URL 환경변수가 설정되지 않았습니다.");
  }

  return url.replace(/\/$/, "");
}

/** 사이트 이름은 title 템플릿과 og:site_name이 함께 씁니다. */
export const SITE_NAME = "GN특장";

/**
 * 페이지에서 openGraph를 정의하면 레이아웃의 openGraph가 통째로 대체되어
 * siteName·locale이 사라집니다. 페이지마다 이 값을 펼쳐 넣습니다.
 */
export const OPEN_GRAPH_DEFAULTS = {
  siteName: SITE_NAME,
  locale: "ko_KR",
} as const;
