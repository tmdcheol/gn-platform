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
    // 주소도 API가 쪼개서 내려줍니다. 화면용 한 줄 주소를 그대로 넣으면 시·구가 중복됩니다.
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.streetAddress,
      addressLocality: contact.addressLocality,
      addressRegion: contact.addressRegion,
      addressCountry: "KR",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: contact.addressRegion },
      { "@type": "Country", name: "대한민국" },
    ],
    // 검색 결과에 "영업 중 / 영업 종료"로 노출되는 항목입니다.
    // API를 먼저 배포하지 않으면 이 필드가 없는 응답이 올 수 있어 빈 배열을 견딥니다.
    openingHoursSpecification: (contact.businessHours ?? []).map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes,
    })),
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
