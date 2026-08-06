import { Suspense } from "react";

import { apiFetch } from "@/lib/api";
import type { Contact } from "@/lib/types";

const CHIPS = ["무료 대차", "전국 무료 픽업", "전국 견인", "보험 접수 대행"];

export default function Hero() {
  return (
    <section className="hero-canvas border-b border-border">
      <div className="wrap section-y grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div>
          <span className="eyebrow">탑차 · 윙바디 · 냉동탑 · 리프트</span>
          <h1 className="display mt-4">
            멈춘 특장차,
            <br />
            오늘 다시 굴러가게
          </h1>
          <p className="lead mt-6 max-w-lg">
            수리하는 동안 차가 없어 일이 멈추지 않도록 대차를 무료로 드립니다.
            전국 어디든 픽업하고, 보험 접수까지 대신 처리합니다.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <li
                key={chip}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="h-3.5 w-3.5 text-brand"
                >
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <Suspense fallback={<HeroContactSkeleton />}>
          <HeroContact />
        </Suspense>
      </div>
    </section>
  );
}

async function HeroContact() {
  let contact: Contact | null = null;

  try {
    contact = await apiFetch<Contact>("/api/contact");
  } catch {
    contact = null;
  }

  if (!contact) {
    return (
      <div className="card p-7 text-muted">
        연락처를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  return (
    <div className="card p-7 md:p-8">
      <p className="text-sm font-semibold text-muted">지금 바로 상담하세요</p>
      <a
        href={`tel:${contact.phone.replace(/-/g, "")}`}
        className="mt-1 block text-[2rem] font-extrabold tracking-tight tabular-nums md:text-[2.4rem]"
      >
        {contact.phone}
      </a>
      <p className="mt-1 text-sm text-muted">
        콜센터 {contact.callCenter.join(" · ")}
      </p>

      <div className="mt-7 grid gap-3">
        <a
          href={`tel:${contact.phone.replace(/-/g, "")}`}
          className="btn btn-primary w-full"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-5 w-5"
          >
            <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7 2 2 0 016.5 3.5z" />
          </svg>
          전화 상담
        </a>
        <a
          href={contact.kakaoOpenChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline w-full"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-5 w-5"
          >
            <path d="M21 11.5c0 4-4 7-9 7a11 11 0 01-2.6-.3L4.5 20l1.2-3.3A7.6 7.6 0 013 11.5c0-4 4-7 9-7s9 3 9 7z" />
          </svg>
          카톡 상담
        </a>
      </div>

      <p className="mt-5 border-t border-border pt-5 text-sm text-muted">
        {contact.address}
      </p>
    </div>
  );
}

function HeroContactSkeleton() {
  return (
    <div className="card animate-pulse p-7 md:p-8" aria-hidden>
      <div className="h-4 w-32 rounded bg-surface-2" />
      <div className="mt-3 h-10 w-64 max-w-full rounded bg-surface-2" />
      <div className="mt-2 h-4 w-48 rounded bg-surface-2" />
      <div className="mt-7 grid gap-3">
        <div className="h-14 rounded-xl bg-surface-2" />
        <div className="h-14 rounded-xl bg-surface-2" />
      </div>
      <div className="mt-5 h-4 w-56 max-w-full rounded bg-surface-2" />
    </div>
  );
}
