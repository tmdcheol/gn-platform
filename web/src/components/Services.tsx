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
const CARD_CLASS = "card card-hover p-8";

export default function Services() {
  return (
    <section className="border-y border-border bg-surface-2">
      <div className="wrap section-y">
        <span className="eyebrow">수리 서비스</span>
        <h2 className="headline mt-3 max-w-[20ch]">
          특장 구조물부터 사고 수리까지, 한 곳에서
        </h2>
        <p className="lead mt-5 max-w-lg">
          여러 공장을 돌지 않아도 됩니다. 진단부터 출고까지 한 번에 끝냅니다.
        </p>

        <Suspense fallback={<ServiceGridSkeleton />}>
          <ServiceGrid />
        </Suspense>
      </div>
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
      <p className="mt-12 text-muted">
        서비스 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <ul className={GRID_CLASS}>
      {services.map((service) => (
        <li key={service.id} className={CARD_CLASS}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="h-6 w-6"
            >
              <path d={ICON_PATHS[service.icon] ?? FALLBACK_ICON_PATH} />
            </svg>
          </span>
          <h3 className="mt-6 text-xl font-bold tracking-tight">
            {service.title}
          </h3>
          <p className="mt-2 text-muted">{service.description}</p>
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
          <div className="h-12 w-12 rounded-2xl bg-surface-2" />
          <div className="mt-6 h-6 w-1/2 rounded bg-surface-2" />
          <div className="mt-3 h-4 w-full rounded bg-surface-2" />
          <div className="mt-2 h-4 w-4/5 rounded bg-surface-2" />
        </li>
      ))}
    </ul>
  );
}
