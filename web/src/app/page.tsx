import type { Metadata } from "next";
import { Suspense } from "react";

import Directions from "@/components/Directions";
import Hero from "@/components/Hero";
import LatestPosts from "@/components/LatestPosts";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Strengths from "@/components/Strengths";
import { OPEN_GRAPH_DEFAULTS } from "@/lib/site";

const DESCRIPTION =
  "탑차·윙바디·냉동탑·리프트 수리 전문. 광주 광산구에서 진단부터 출고까지 한 번에 처리하고, 무료 대차와 전국 픽업·견인을 지원합니다.";

export const metadata: Metadata = {
  // layout의 template(%s | GN특장)이 붙지 않도록 default 형태로 덮어씁니다.
  title: {
    absolute: "GN특장 | 탑차·윙바디·냉동탑·리프트 수리 전문",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    title: "GN특장 | 탑차·윙바디·냉동탑·리프트 수리 전문",
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <LocalBusinessJsonLd />
      </Suspense>
      <Hero />
      <Strengths />
      <Services />
      <LatestPosts />
      <Reviews />
      <Directions />
    </>
  );
}
