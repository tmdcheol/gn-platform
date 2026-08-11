import Icon from "@/components/Icon";

const STRENGTHS = [
  {
    badge: "0원",
    title: "무료 대차",
    description:
      "수리하는 동안 대신 굴릴 차를 무료로 내드립니다. 차가 정비소에 있어도 오늘 배송은 나갑니다.",
    icon: "car",
    tags: ["대차료 0원", "픽업비 0원", "견인 접수 대행"],
    featured: true,
  },
  {
    badge: "전국",
    title: "무료 픽업",
    description: "전국 어디든 찾아가 차량을 가져옵니다. 픽업 비용은 없습니다.",
    icon: "pickup",
    tags: [],
    featured: false,
  },
  {
    badge: "24시",
    title: "전국 견인",
    description: "자력 운행이 어려운 차량도 안전하게 입고합니다.",
    icon: "tow",
    tags: [],
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
              item.featured ? "md:col-span-2 md:row-span-2 md:p-10" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`flex items-center justify-center rounded-2xl bg-brand-soft text-brand ${
                  item.featured ? "h-14 w-14" : "h-12 w-12"
                }`}
              >
                <Icon
                  name={item.icon}
                  className={item.featured ? "h-7 w-7" : "h-6 w-6"}
                />
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

              {item.tags.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
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
