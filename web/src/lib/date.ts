/**
 * API가 주는 LocalDateTime("2026-08-15T19:15:00")에는 시간대가 없습니다.
 * Date로 파싱하면 브라우저 시간대에 따라 하루가 밀릴 수 있어 문자열에서 바로 잘라 씁니다.
 */
export function formatDate(isoLocalDateTime: string) {
  const [year, month, day] = isoLocalDateTime.slice(0, 10).split("-");

  return `${year}.${month}.${day}`;
}
