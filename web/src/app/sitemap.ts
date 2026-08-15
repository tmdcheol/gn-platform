import type { MetadataRoute } from "next";

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

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
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
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
