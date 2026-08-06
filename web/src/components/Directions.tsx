import { Suspense } from "react";

import { apiFetch } from "@/lib/api";
import type { Contact } from "@/lib/types";

const BOX_CLASS =
  "mt-12 grid gap-4 md:grid-cols-2 md:gap-8 rounded-2xl border border-black/10 bg-zinc-50 p-8 dark:border-white/10 dark:bg-zinc-900";

// 지도 검색은 도로명 주소만 넘깁니다. 괄호 지번과 "공장"이 섞이면 검색이 0건으로 뜹니다.
function toMapQuery(address: string) {
  return address
    .replace(/\s*\(.*\)\s*/g, " ")
    .replace(/\s*공장\s*/g, " ")
    .trim();
}

export default function Directions() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        오시는 길
      </h2>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        입고 전에 전화 한 통 주시면 대기 없이 바로 봐 드립니다.
      </p>

      <Suspense fallback={<DirectionsBodySkeleton />}>
        <DirectionsBody />
      </Suspense>
    </section>
  );
}

async function DirectionsBody() {
  let contact: Contact | null = null;

  try {
    contact = await apiFetch<Contact>("/api/contact");
  } catch {
    contact = null;
  }

  if (!contact) {
    return (
      <p className="mt-12 text-zinc-500">
        오시는 길 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <div className={BOX_CLASS}>
      <dl className="space-y-6">
        <div>
          <dt className="text-sm text-zinc-500">주소</dt>
          <dd className="mt-1 text-lg font-semibold">{contact.address}</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-500">휴대전화</dt>
          <dd className="mt-1 text-lg font-semibold">
            <a
              href={`tel:${contact.phone.replace(/-/g, "")}`}
              className="hover:underline"
            >
              {contact.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-500">콜센터</dt>
          <dd className="mt-1 flex flex-wrap gap-x-4 text-lg font-semibold">
            {contact.callCenter.map((number) => (
              <a
                key={number}
                href={`tel:${number.replace(/-/g, "")}`}
                className="hover:underline"
              >
                {number}
              </a>
            ))}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col justify-end gap-3">
        <a
          href={`https://map.kakao.com/?q=${encodeURIComponent(toMapQuery(contact.address))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center rounded-xl bg-blue-700 px-8 text-base font-semibold text-white transition-colors hover:bg-blue-800"
        >
          카카오맵으로 길찾기
        </a>
        <a
          href={`https://map.naver.com/p/search/${encodeURIComponent(toMapQuery(contact.address))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center rounded-xl border border-black/15 px-8 text-base font-semibold transition-colors hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
        >
          네이버 지도로 보기
        </a>
      </div>
    </div>
  );
}

function DirectionsBodySkeleton() {
  return (
    <div className={`${BOX_CLASS} animate-pulse`} aria-hidden>
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i}>
            <div className="h-4 w-16 rounded bg-black/10 dark:bg-white/10" />
            <div className="mt-2 h-6 w-64 max-w-full rounded bg-black/10 dark:bg-white/10" />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-end gap-3">
        <div className="h-14 rounded-xl bg-black/10 dark:bg-white/10" />
        <div className="h-14 rounded-xl bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}
