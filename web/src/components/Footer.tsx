import Link from "next/link";
import { Suspense } from "react";

import { apiFetch } from "@/lib/api";
import type { Contact } from "@/lib/types";

const DL_CLASS = "grid gap-6 sm:grid-cols-3";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="wrap py-14 text-sm">
        <div className="flex flex-col gap-8 border-b border-border pb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-black text-brand-contrast">
                GN
              </span>
              <span className="text-[1.0625rem] font-bold tracking-tight">
                GN특장
              </span>
            </div>
            <p className="mt-3 text-muted">
              탑차 · 윙바디 · 냉동탑 · 리프트 수리 전문
            </p>
          </div>

          <nav className="flex gap-6 font-medium">
            <Link href="/" className="text-muted hover:text-foreground">
              홈
            </Link>
            <Link href="/blog" className="text-muted hover:text-foreground">
              블로그
            </Link>
          </nav>
        </div>

        <div className="py-10">
          <Suspense fallback={<FooterContactSkeleton />}>
            <FooterContact />
          </Suspense>
        </div>

        <p className="text-xs text-muted">© {new Date().getFullYear()} GN특장</p>
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
      <p className="text-muted">
        연락처를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <dl className={DL_CLASS}>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-muted">주소</dt>
        <dd className="mt-1.5 font-medium">{contact.address}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-muted">
          휴대전화
        </dt>
        <dd className="mt-1.5 font-medium tabular-nums">
          <a
            href={`tel:${contact.phone.replace(/-/g, "")}`}
            className="hover:text-brand"
          >
            {contact.phone}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-xs font-semibold tracking-wide text-muted">
          콜센터
        </dt>
        <dd className="mt-1.5 flex flex-wrap gap-x-4 font-medium tabular-nums">
          {contact.callCenter.map((number) => (
            <a
              key={number}
              href={`tel:${number.replace(/-/g, "")}`}
              className="hover:text-brand"
            >
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
          <div className="h-3 w-14 rounded bg-surface-2" />
          <div className="mt-2 h-5 w-44 max-w-full rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}
