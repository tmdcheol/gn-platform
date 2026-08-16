/**
 * API가 주는 LocalDateTime("2026-08-15T19:15:00")에는 시간대가 없습니다.
 * Date로 파싱하면 브라우저 시간대에 따라 하루가 밀릴 수 있어 문자열에서 바로 잘라 씁니다.
 */
export function formatDate(isoLocalDateTime: string) {
  const [year, month, day] = isoLocalDateTime.slice(0, 10).split("-");

  return `${year}.${month}.${day}`;
}

/**
 * 기계가 읽는 날짜(YYYY-MM-DD). 사이트맵 lastmod와 JSON-LD의 날짜에 씁니다.
 * 시각까지 넣으려면 API가 준 벽시계 시간이 어느 시간대인지 알아야 하는데,
 * 서버 시간대가 갈리면 9시간씩 어긋납니다. 알 수 없는 값을 지어내는 대신 날짜만 씁니다.
 */
export function toIsoDate(isoLocalDateTime: string) {
  return isoLocalDateTime.slice(0, 10);
}
