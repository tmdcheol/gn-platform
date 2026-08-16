import { toIsoDate } from "@/lib/date";
import type { Contact, Post } from "@/lib/types";
import { SITE_NAME, siteUrl } from "@/lib/site";

/**
 * 지역 업체 정보. 검색 결과에 상호·주소·전화가 직접 노출됩니다.
 * 연락처 값은 /api/contact에서만 옵니다 — 여기에 하드코딩하지 않습니다.
 */
export function localBusinessJsonLd(contact: Contact) {
  const base = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${base}/#business`,
    name: SITE_NAME,
    url: base,
    description:
      "탑차·윙바디·냉동탑·리프트 수리 전문. 무료 대차와 전국 픽업·견인을 지원합니다.",
    telephone: contact.phone,
    // 콜센터 번호도 실제로 연결되는 창구라 함께 노출합니다.
    contactPoint: contact.callCenter.map((number) => ({
      "@type": "ContactPoint",
      telephone: number,
      contactType: "customer service",
      areaServed: "KR",
      availableLanguage: "Korean",
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: "광주광역시 광산구",
      addressCountry: "KR",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "광주광역시" },
      { "@type": "Country", name: "대한민국" },
    ],
  };
}

/** 블로그 글. */
export function articleJsonLd(post: Post) {
  const base = siteUrl();
  const url = `${base}/blog/${encodeURIComponent(post.slug)}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    datePublished: toIsoDate(post.createdAt),
    dateModified: toIsoDate(post.updatedAt),
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      "@id": `${base}/#business`,
    },
    ...(post.thumbnailUrl ? { image: [post.thumbnailUrl] } : {}),
  };
}

/** 홈 > 블로그 > 글 제목 같은 경로. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  const base = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}
