import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileCtaBar from "@/components/MobileCtaBar";
import { SITE_NAME, siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // 상대 경로로 쓴 canonical·og:image를 절대 URL로 만들어 줍니다.
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} | 탑차·윙바디·냉동탑·리프트 수리 전문`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "광주 광산구 특장차 수리 전문점. 무료 대차, 전국 무료 픽업, 전국 견인.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-24 md:pb-0">
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Suspense fallback={null}>
          <MobileCtaBar />
        </Suspense>
      </body>
    </html>
  );
}
