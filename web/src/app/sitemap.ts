import type { MetadataRoute } from "next";

import { toSitemapDate } from "@/lib/date";
import { getPosts, getServices } from "@/lib/data";
import { siteUrl } from "@/lib/site";

/**
 * 메인 + /blog + 발행된 글 전체 + 서비스 랜딩 8개.
 *
 * 글은 `/api/posts`(공개 목록)에서 가져오므로 임시저장 글은 애초에 넘어오지 않습니다.
 * API가 죽어도 사이트맵 자체가 깨지지 않도록, 못 가져온 부분만 빠지고 나머지는 남깁니다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [posts, services] = await Promise.all([getPosts(), getServices()]);

  // 목록의 최신성은 가장 최근에 수정된 글이 알려줍니다.
  // 메인은 근거가 될 신호가 없어 lastmod를 붙이지 않습니다 —
  // new Date()를 쓰면 요청마다 "방금 수정됨"이 되어 신호가 무의미해집니다.
  const latestPostUpdate = (posts ?? [])
    .map((post) => post.updatedAt)
    .sort()
    .at(-1);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      ...(latestPostUpdate
        ? { lastModified: toSitemapDate(latestPostUpdate) }
        : {}),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map(
    (service) => ({
      url: `${base}/services/${encodeURIComponent(service.slug)}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${base}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: toSitemapDate(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
