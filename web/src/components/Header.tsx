"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "블로그" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          광남특장차
        </Link>

        <nav className="hidden gap-8 text-sm font-medium md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 md:hidden dark:border-white/15"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-black/10 md:hidden dark:border-white/10">
          <ul className="mx-auto max-w-6xl px-5 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
