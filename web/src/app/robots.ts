import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 관리 화면은 색인 대상이 아닙니다.
      disallow: "/admin",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
