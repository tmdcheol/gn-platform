import Link from "next/link";
import { Suspense } from "react";

import BrandMark from "@/components/BrandMark";
import DataError from "@/components/DataError";
import { NAV_ITEMS } from "@/lib/nav";
import { getContact } from "@/lib/data";
import { telHref } from "@/lib/phone";

const DL_CLASS = "grid gap-6 sm:grid-cols-3";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="wrap py-14 text-sm">
        <div className="flex flex-col gap-8 border-b border-border pb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <BrandMark />
            <p className="mt-3 text-muted">
              탑차 · 윙바디 · 냉동탑 · 리프트 수리 전문
            </p>
          </div>

          <nav aria-label="푸터" className="flex gap-6 font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
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
  const contact = await getContact();

  if (!contact) {
    return <DataError className="">연락처를 불러오지 못했습니다.</DataError>;
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
          <a href={telHref(contact.phone)} className="hover:text-brand">
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
              href={telHref(number)}
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
