import { Suspense } from "react";

import DataError from "@/components/DataError";
import Icon from "@/components/Icon";
import { getContact } from "@/lib/data";
import { telHref } from "@/lib/phone";

// 지도 검색은 도로명 주소만 넘깁니다. 괄호 지번과 "공장"이 섞이면 검색이 0건으로 뜹니다.
function toMapQuery(address: string) {
  return address
    .replace(/\s*\(.*\)\s*/g, " ")
    .replace(/\s*공장\s*/g, " ")
    .trim();
}

const BODY_CLASS = "mt-12 grid gap-4 lg:grid-cols-[1fr_1.1fr]";

export default function Directions() {
  return (
    <section className="border-t border-border bg-surface-2">
      <div className="wrap section-y">
        <span className="eyebrow">오시는 길</span>
        <h2 className="headline mt-3 max-w-[18ch]">
          입고 전 전화 한 통이면 대기 없이
        </h2>
        <p className="lead mt-5 max-w-lg">
          증상만 먼저 말씀해 주시면 필요한 부품을 미리 준비해 둡니다.
        </p>

        <Suspense fallback={<DirectionsBodySkeleton />}>
          <DirectionsBody />
        </Suspense>
      </div>
    </section>
  );
}

async function DirectionsBody() {
  const contact = await getContact();

  if (!contact) {
    return <DataError>오시는 길 정보를 불러오지 못했습니다.</DataError>;
  }

  const mapQuery = encodeURIComponent(toMapQuery(contact.address));

  return (
    <div className={BODY_CLASS}>
      <div className="card p-8 md:p-10">
        <dl className="space-y-7">
          <div>
            <dt className="text-sm font-semibold text-muted">주소</dt>
            <dd className="mt-1.5 text-lg font-bold tracking-tight">
              {contact.address}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-muted">휴대전화</dt>
            <dd className="mt-1.5">
              <a
                href={telHref(contact.phone)}
                className="text-lg font-bold tracking-tight tabular-nums hover:text-brand"
              >
                {contact.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-muted">콜센터</dt>
            <dd className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
              {contact.callCenter.map((number) => (
                <a
                  key={number}
                  href={telHref(number)}
                  className="text-lg font-bold tracking-tight tabular-nums hover:text-brand"
                >
                  {number}
                </a>
              ))}
            </dd>
          </div>
        </dl>

        <a
          href={contact.kakaoOpenChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-9 w-full"
        >
          카카오톡으로 상담하기
        </a>
      </div>

      <div className="card hero-canvas flex flex-col justify-between overflow-hidden p-8 md:p-10">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-brand-contrast">
            <Icon name="pin" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-bold tracking-tight">GN특장 공장</p>
            <p className="mt-1 text-sm text-muted">
              {toMapQuery(contact.address)}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          <a
            href={`https://map.kakao.com/?q=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full"
          >
            카카오맵
          </a>
          <a
            href={`https://map.naver.com/p/search/${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full"
          >
            네이버 지도
          </a>
        </div>
        <p className="mt-4 text-xs text-muted">
          버튼을 누르면 지도 앱에서 길찾기로 이어집니다.
        </p>
      </div>
    </div>
  );
}

function DirectionsBodySkeleton() {
  return (
    <div className={BODY_CLASS} aria-hidden>
      <div className="card animate-pulse p-8 md:p-10">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={i === 0 ? "" : "mt-7"}>
            <div className="h-4 w-16 rounded bg-surface-2" />
            <div className="mt-2 h-6 w-64 max-w-full rounded bg-surface-2" />
          </div>
        ))}
        <div className="mt-9 h-14 rounded-xl bg-surface-2" />
      </div>
      <div className="card animate-pulse p-8 md:p-10">
        <div className="h-11 w-11 rounded-2xl bg-surface-2" />
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          <div className="h-14 rounded-xl bg-surface-2" />
          <div className="h-14 rounded-xl bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
