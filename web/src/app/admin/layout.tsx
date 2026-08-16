import type { Metadata } from "next";

/** 관리자 화면은 검색에 잡히면 안 됩니다. robots.txt(T-29)에 더해 메타데이터로도 막습니다. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
