/** 헤더·푸터가 함께 쓰는 로고 마크. */
export default function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-black text-brand-contrast"
      >
        GN
      </span>
      <span className="text-[1.0625rem] font-bold tracking-tight">GN특장</span>
    </span>
  );
}
