/**
 * 구조화 데이터를 서버에서 출력합니다.
 *
 * `<`를 이스케이프하는 이유: 값에 `</script>`가 섞이면 스크립트 블록이 그 자리에서 닫혀
 * 뒤따르는 내용이 마크업으로 실행됩니다. JSON 문법상 <는 그대로 `<`로 파싱됩니다.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
