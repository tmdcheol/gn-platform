import { Suspense } from "react";

import DataError from "@/components/DataError";
import Icon from "@/components/Icon";
import { getServices } from "@/lib/data";

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
  const services = await getServices();

  if (!services) {
    return <DataError>서비스 목록을 불러오지 못했습니다.</DataError>;
  }

  return (
    <ul className={GRID_CLASS}>
      {services.map((service) => (
        <li key={service.id} className={CARD_CLASS}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Icon name={service.icon} />
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
