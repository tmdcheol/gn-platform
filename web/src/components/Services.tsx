import { Suspense } from "react";

import { apiFetch } from "@/lib/api";
import type { RepairService } from "@/lib/types";

// API의 icon 키 → 라인 아이콘 path. 없는 키는 기본 도형으로 떨어집니다.
const ICON_PATHS: Record<string, string> = {
  truck: "M3 7h11v10H3zM14 10h4l3 3v4h-7z M7 17a2 2 0 104 0 M16 17a2 2 0 104 0",
  wing: "M12 20V8 M12 8L3 4v6l9 2 M12 8l9-4v6l-9 2",
  snowflake: "M12 3v18 M4 7l16 10 M20 7L4 17",
  lift: "M4 18h16 M6 18V9h8v9 M14 12h6",
  shield: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z",
  car: "M4 16h16v-4l-2-4H6L4 12z M7 16a2 2 0 104 0 M13 16a2 2 0 104 0",
  pickup: "M12 3v10 M8 9l4 4 4-4 M4 17v3h16v-3",
  tow: "M4 17h9v-5H4z M13 12l5-7 M7 17a2 2 0 104 0 M15 17a2 2 0 104 0",
};

const FALLBACK_ICON_PATH = "M12 3l9 9-9 9-9-9z";

const GRID_CLASS = "mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3";
const CARD_CLASS =
  "rounded-2xl border border-black/10 bg-zinc-50 p-8 dark:border-white/10 dark:bg-zinc-900";

export default function Services() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        수리 서비스
      </h2>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        특장 구조물부터 사고 수리까지, 한 곳에서 끝냅니다.
      </p>

      <Suspense fallback={<ServiceGridSkeleton />}>
        <ServiceGrid />
      </Suspense>
    </section>
  );
}

async function ServiceGrid() {
  let services: RepairService[] | null = null;

  try {
    services = await apiFetch<RepairService[]>("/api/services");
  } catch {
    services = null;
  }

  if (!services) {
    return (
      <p className="mt-12 text-zinc-500">
        서비스 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <ul className={GRID_CLASS}>
      {services.map((service) => (
        <li key={service.id} className={CARD_CLASS}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-8 w-8 text-blue-700 dark:text-blue-400"
          >
            <path d={ICON_PATHS[service.icon] ?? FALLBACK_ICON_PATH} />
          </svg>
          <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {service.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

function ServiceGridSkeleton() {
  return (
    <ul className={GRID_CLASS} aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className={`${CARD_CLASS} animate-pulse`}>
          <div className="h-8 w-8 rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-5 h-6 w-1/2 rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-3 h-4 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-2 h-4 w-4/5 rounded bg-black/10 dark:bg-white/10" />
        </li>
      ))}
    </ul>
  );
}
