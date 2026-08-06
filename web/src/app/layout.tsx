import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileCtaBar from "@/components/MobileCtaBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GN특장 | 탑차·윙바디·냉동탑·리프트 수리 전문",
  description:
    "광주 광산구 특장차 수리 전문점. 무료 대차, 전국 무료 픽업, 전국 견인.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 md:pb-0">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Suspense fallback={null}>
          <MobileCtaBar />
        </Suspense>
      </body>
    </html>
  );
}
