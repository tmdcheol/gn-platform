import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 마크다운을 진짜 태그(h2·ul·a …)로 렌더합니다. 크롤러가 구조를 읽어야 하므로
 * 문자열을 통째로 <p>에 넣지 않습니다.
 *
 * rehype-raw는 켜지 않습니다. 켜는 순간 본문의 원시 HTML이 그대로 실행돼 XSS가 열립니다.
 * 타이포 스타일은 감싸는 쪽의 article-body 유틸이 담당합니다.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 외부 링크는 새 탭으로 열되, 탭 하이재킹을 막습니다.
        a: ({ href, children: linkChildren, ...props }) => {
          const isExternal = href?.startsWith("http");

          return (
            <a
              href={href}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              {...props}
            >
              {linkChildren}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
