import { Suspense } from "react";

import { apiFetch } from "@/lib/api";
import type { Contact } from "@/lib/types";

const DL_CLASS =
  "mt-6 grid gap-3 text-zinc-700 sm:grid-cols-3 dark:text-zinc-300";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-5 py-12 text-sm">
        <p className="text-base font-bold">GN특장</p>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          탑차 · 윙바디 · 냉동탑 · 리프트 수리 전문
        </p>

        <Suspense fallback={<FooterContactSkeleton />}>
          <FooterContact />
        </Suspense>

        <p className="mt-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} GN특장
        </p>
      </div>
    </footer>
  );
}

async function FooterContact() {
  let contact: Contact | null = null;

  try {
    contact = await apiFetch<Contact>("/api/contact");
  } catch {
    contact = null;
  }

  if (!contact) {
    return (
      <p className="mt-6 text-zinc-500">
        연락처를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <dl className={DL_CLASS}>
      <div>
        <dt className="text-zinc-500 dark:text-zinc-500">주소</dt>
        <dd className="mt-1">{contact.address}</dd>
      </div>
      <div>
        <dt className="text-zinc-500 dark:text-zinc-500">휴대전화</dt>
        <dd className="mt-1">
          <a href={`tel:${contact.phone.replace(/-/g, "")}`}>{contact.phone}</a>
        </dd>
      </div>
      <div>
        <dt className="text-zinc-500 dark:text-zinc-500">콜센터</dt>
        <dd className="mt-1 flex flex-wrap gap-x-3">
          {contact.callCenter.map((number) => (
            <a key={number} href={`tel:${number.replace(/-/g, "")}`}>
              {number}
            </a>
          ))}
        </dd>
      </div>
    </dl>
  );
}

function FooterContactSkeleton() {
  return (
    <div className={`${DL_CLASS} animate-pulse`} aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i}>
          <div className="h-4 w-16 rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-2 h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
}
