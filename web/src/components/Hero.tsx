import { Suspense } from "react";

import { apiFetch } from "@/lib/api";
import type { Contact } from "@/lib/types";

const PRIMARY_CTA_CLASS =
  "flex h-14 items-center justify-center rounded-xl bg-blue-700 px-8 text-base font-semibold text-white transition-colors hover:bg-blue-800 sm:w-auto";
const SECONDARY_CTA_CLASS =
  "flex h-14 items-center justify-center rounded-xl border border-black/15 px-8 text-base font-semibold transition-colors hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]";
const CTA_ROW_CLASS = "mt-10 flex flex-col gap-3 sm:flex-row";

export default function Hero() {
  return (
    <section className="border-b border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
          탑차 · 윙바디 · 냉동탑 · 리프트
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl leading-tight font-bold tracking-tight md:text-5xl md:leading-tight">
          멈춘 특장차, 오늘 안에 다시 굴러가게
        </h1>
        <p className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          무료 대차와 전국 무료 픽업으로 일이 멈추지 않게 합니다. 보험·사고
          수리까지 한 곳에서 끝내세요.
        </p>

        <Suspense fallback={<HeroCtaSkeleton />}>
          <HeroCta />
        </Suspense>
      </div>
    </section>
  );
}

async function HeroCta() {
  let contact: Contact | null = null;

  try {
    contact = await apiFetch<Contact>("/api/contact");
  } catch {
    contact = null;
  }

  if (!contact) {
    return (
      <p className="mt-10 text-sm text-red-600 dark:text-red-400">
        연락처를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <div className={CTA_ROW_CLASS}>
      <a
        href={`tel:${contact.phone.replace(/-/g, "")}`}
        className={PRIMARY_CTA_CLASS}
      >
        전화 상담 {contact.phone}
      </a>
      <a
        href={contact.kakaoOpenChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={SECONDARY_CTA_CLASS}
      >
        카톡 상담
      </a>
    </div>
  );
}

function HeroCtaSkeleton() {
  return (
    <div className={`${CTA_ROW_CLASS} animate-pulse`} aria-hidden>
      <div className="h-14 w-full rounded-xl bg-black/10 sm:w-64 dark:bg-white/10" />
      <div className="h-14 w-full rounded-xl bg-black/10 sm:w-40 dark:bg-white/10" />
    </div>
  );
}
