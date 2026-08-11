"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import BrandMark from "@/components/BrandMark";
import { NAV_ITEMS } from "@/lib/nav";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 경로가 바뀌면 모바일 메뉴를 닫습니다(뒤로가기로 이동한 경우 포함).
  // effect가 아니라 렌더 중 조정 — React가 권장하는 파생 상태 갱신 방식입니다.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" aria-label="GN특장 홈">
          <BrandMark />
        </Link>

        <nav aria-label="주요" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={
                isActive(item.href)
                  ? "rounded-full bg-surface-2 px-4 py-2 text-sm font-semibold"
                  : "rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border md:hidden"
        >
          <span aria-hidden className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-transform ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 rounded bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-transform ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="모바일"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <ul className="wrap py-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block py-3 text-base ${
                  isActive(item.href) ? "font-semibold" : "font-medium text-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
