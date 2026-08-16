/**
 * "광주광역시" → "광주". 사람들이 실제로 검색하는 형태로 줄입니다
 * ("광주광역시 윙바디 수리"가 아니라 "광주 윙바디 수리"로 찾습니다).
 * 값 자체는 /api/contact에서 오고, 여기서는 표기만 다듬습니다.
 */
export function shortRegion(addressRegion: string) {
  return addressRegion.replace(/(특별자치시|특별자치도|특별시|광역시|도)$/, "");
}
