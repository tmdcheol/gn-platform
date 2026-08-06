const ICON = {
  car: "M4 16h16v-4l-2-4H6L4 12z M7 16a2 2 0 104 0 M13 16a2 2 0 104 0",
  pickup: "M12 3v10 M8 9l4 4 4-4 M4 17v3h16v-3",
  tow: "M4 17h9v-5H4z M13 12l5-7 M7 17a2 2 0 104 0 M15 17a2 2 0 104 0",
};

const STRENGTHS = [
  {
    badge: "0원",
    title: "무료 대차",
    description:
      "수리하는 동안 대신 굴릴 차를 무료로 내드립니다. 차가 정비소에 있어도 오늘 배송은 나갑니다.",
    icon: ICON.car,
    featured: true,
  },
  {
    badge: "전국",
    title: "무료 픽업",
    description: "전국 어디든 찾아가 차량을 가져옵니다. 픽업 비용은 없습니다.",
    icon: ICON.pickup,
    featured: false,
  },
  {
    badge: "24시",
    title: "전국 견인",
    description: "자력 운행이 어려운 차량도 안전하게 입고합니다.",
    icon: ICON.tow,
    featured: false,
  },
];

export default function Strengths() {
  return (
    <section className="wrap section-y">
      <span className="eyebrow">왜 GN특장인가</span>
      <h2 className="headline mt-3 max-w-[18ch]">
        차가 멈춰도, 일은 멈추지 않게
      </h2>
      <p className="lead mt-5 max-w-lg">
        수리비 외에 따로 받는 비용이 없습니다. 대차·픽업·견인 모두 포함입니다.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {STRENGTHS.map((item) => (
          <article
            key={item.title}
            className={`card card-hover flex flex-col justify-between p-8 ${
              item.featured
                ? "md:col-span-2 md:row-span-2 md:p-10"
                : "md:col-span-1"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`flex items-center justify-center rounded-2xl bg-brand-soft text-brand ${
                  item.featured ? "h-14 w-14" : "h-12 w-12"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className={item.featured ? "h-7 w-7" : "h-6 w-6"}
                >
                  <path d={item.icon} />
                </svg>
              </span>
              <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-muted">
                {item.badge}
              </span>
            </div>

            <div className={item.featured ? "mt-14" : "mt-10"}>
              <h3
                className={`font-bold tracking-tight ${
                  item.featured ? "text-2xl md:text-3xl" : "text-xl"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-2 text-muted ${item.featured ? "max-w-md text-lg" : ""}`}
              >
                {item.description}
              </p>

              {item.featured && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {["대차료 0원", "픽업비 0원", "견인 접수 대행"].map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
