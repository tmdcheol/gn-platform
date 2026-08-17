import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import DataError from "@/components/DataError";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import {
  getContact,
  getPosts,
  getService,
  getServices,
} from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/jsonLd";
import { telHref } from "@/lib/phone";
import { shortRegion } from "@/lib/region";
import { OPEN_GRAPH_DEFAULTS, SITE_NAME } from "@/lib/site";
import type { Contact, Post, RepairService } from "@/lib/types";

/** 8개 슬러그를 미리 만들어 둡니다. API가 죽어 있으면 요청 시점에 렌더합니다. */
export async function generateStaticParams() {
  const services = await getServices();

  return (services ?? []).map((service) => ({ slug: service.slug }));
}

/**
 * "광주 윙바디 수리"처럼 지역+서비스로 잡습니다.
 * 다만 전국 픽업·견인은 지역 한정 서비스가 아니라 "광주 전국 견인"이 되어버리므로
 * (검색하는 사람도 없습니다) 서비스가 regional일 때만 지역을 붙입니다.
 */
function pageTitle(service: RepairService, contact: Contact | null) {
  return service.regional && contact
    ? `${shortRegion(contact.addressRegion)} ${service.title}`
    : service.title;
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [service, contact] = await Promise.all([getService(slug), getContact()]);

  if (service === "not-found") {
    return { title: "서비스를 찾을 수 없습니다" };
  }

  if (service === null) {
    return { title: "서비스를 불러오지 못했습니다", robots: { index: false } };
  }

  const title = pageTitle(service, contact);
  const canonical = `/services/${service.slug}`;

  return {
    title,
    description: service.description,
    alternates: { canonical },
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      title: `${title} | ${SITE_NAME}`,
      description: service.description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, contact, posts] = await Promise.all([
    getService(slug),
    getContact(),
    getPosts(),
  ]);

  if (service === "not-found") {
    notFound();
  }

  if (service === null) {
    return (
      <div className="wrap section-y">
        <DataError className="mt-0">서비스 정보를 불러오지 못했습니다.</DataError>
        <Link href="/" className="btn btn-outline mt-8">
          홈으로
        </Link>
      </div>
    );
  }

  const title = pageTitle(service, contact);
  const relatedPosts = findRelatedPosts(service, posts);
  // 이 서비스를 다룬 글이 아직 없어도 블로그로 가는 길은 남겨 둡니다.
  const fallbackPosts = relatedPosts.length > 0 ? [] : (posts ?? []).slice(0, 3);
  const linkedPosts = relatedPosts.length > 0 ? relatedPosts : fallbackPosts;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />

      <section className="hero-canvas border-b border-border">
        <div className="wrap section-y">
          <span className="eyebrow">수리 서비스</span>
          <h1 className="display mt-4 max-w-[16ch]">{title}</h1>
          <p className="lead mt-6 max-w-xl">{service.description}</p>
        </div>
      </section>

      <div className="wrap section-y grid gap-14 lg:grid-cols-[1.4fr_.9fr] lg:gap-20">
        <div>
          <h2 className="headline">이런 증상이면 점검하세요</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {service.symptoms.map((symptom) => (
              <li
                key={symptom}
                className="card flex items-start gap-3 p-5 text-[0.9375rem]"
              >
                <Icon
                  name="check"
                  strokeWidth={2.5}
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                />
                {symptom}
              </li>
            ))}
          </ul>

          <div className="article-body mt-16">
            {service.longDescription
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph.slice(0, 20)}>{paragraph}</p>
              ))}
          </div>

          {linkedPosts.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <h2 className="text-xl font-bold tracking-tight">
                {relatedPosts.length > 0 ? "관련 정비 이야기" : "최근 정비 이야기"}
              </h2>
              <ul className="mt-5 grid gap-2">
                {linkedPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-surface-2"
                    >
                      <span className="font-medium">{post.title}</span>
                      <Icon
                        name="arrow-right"
                        className="h-4 w-4 shrink-0 text-muted"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <ServiceCta contact={contact} />
      </div>
    </>
  );
}

function ServiceCta({ contact }: { contact: Contact | null }) {
  if (!contact) {
    return (
      <div className="card h-fit p-7">
        <DataError className="mt-0">연락처를 불러오지 못했습니다.</DataError>
      </div>
    );
  }

  return (
    <div className="card h-fit p-7 lg:sticky lg:top-8">
      <p className="text-sm font-semibold text-muted">증상만 말씀해 주세요</p>
      <a
        href={telHref(contact.phone)}
        className="mt-1 block text-[1.75rem] font-extrabold tracking-tight tabular-nums"
      >
        {contact.phone}
      </a>
      <p className="mt-1 text-sm text-muted">
        콜센터 {contact.callCenter.join(" · ")}
      </p>

      <div className="mt-6 grid gap-3">
        <a href={telHref(contact.phone)} className="btn btn-primary w-full">
          <Icon name="phone" className="h-5 w-5" strokeWidth={1.8} />
          전화 상담
        </a>
        <a
          href={contact.kakaoOpenChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline w-full"
        >
          <Icon name="chat" className="h-5 w-5" strokeWidth={1.8} />
          카톡 상담
        </a>
      </div>

      <p className="mt-5 border-t border-border pt-5 text-sm text-muted">
        {contact.address}
      </p>
    </div>
  );
}

/**
 * 글에 분류가 없어서 서비스명에서 뽑은 낱말로 제목·요약을 훑습니다.
 * "수리"처럼 모든 서비스에 붙는 낱말은 빼야 전부 매칭돼 버리지 않습니다.
 */
const GENERIC_WORDS = ["수리", "무료", "전국"];

function findRelatedPosts(service: RepairService, posts: Post[] | null) {
  const keywords = service.title
    .split(/[\s·]+/)
    .filter((word) => word.length > 1 && !GENERIC_WORDS.includes(word));

  return (posts ?? [])
    .filter((post) =>
      keywords.some(
        (keyword) =>
          post.title.includes(keyword) || post.excerpt.includes(keyword),
      ),
    )
    .slice(0, 4);
}
