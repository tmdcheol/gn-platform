/** tel: 링크에는 하이픈을 뺀 번호가 들어가야 합니다. */
export function telHref(phoneNumber: string) {
  return `tel:${phoneNumber.replace(/-/g, "")}`;
}
