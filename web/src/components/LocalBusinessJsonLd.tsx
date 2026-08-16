import JsonLd from "@/components/JsonLd";
import { getContact } from "@/lib/data";
import { localBusinessJsonLd } from "@/lib/jsonLd";

/**
 * 연락처를 못 가져오면 아무것도 출력하지 않습니다.
 * 전화번호 없는 LocalBusiness를 내보내는 것보다 없는 편이 낫습니다.
 */
export default async function LocalBusinessJsonLd() {
  const contact = await getContact();

  if (!contact) {
    return null;
  }

  return <JsonLd data={localBusinessJsonLd(contact)} />;
}
