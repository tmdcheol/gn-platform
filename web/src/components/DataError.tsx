/** API 조회 실패 시 섹션 자리에 표시하는 공통 안내. 화면이 비지 않게 합니다. */
export default function DataError({
  children,
  className = "mt-12",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p role="status" className={`${className} text-muted`}>
      {children} 잠시 후 다시 시도해 주세요.
    </p>
  );
}
