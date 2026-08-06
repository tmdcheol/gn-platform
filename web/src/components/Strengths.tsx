const STRENGTHS = [
  {
    title: "무료 대차",
    description:
      "수리하는 동안 차가 없어 일이 멈추지 않도록, 같은 급의 대차를 무료로 내드립니다.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "무료 전국 픽업",
    description: "전국 어디든 찾아가 차량을 가져옵니다. 픽업 비용은 없습니다.",
    className: "md:col-span-1",
  },
  {
    title: "전국 견인",
    description: "자력 운행이 어려운 차량도 견인으로 안전하게 입고합니다.",
    className: "md:col-span-1",
  },
];

export default function Strengths() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
        차가 멈춰도, 일은 멈추지 않게
      </h2>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        수리비 외에 따로 받는 비용이 없습니다.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {STRENGTHS.map((strength) => (
          <div
            key={strength.title}
            className={`flex flex-col justify-end rounded-2xl border border-black/10 bg-zinc-50 p-8 dark:border-white/10 dark:bg-zinc-900 ${strength.className}`}
          >
            <h3 className="text-xl font-bold md:text-2xl">{strength.title}</h3>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              {strength.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
