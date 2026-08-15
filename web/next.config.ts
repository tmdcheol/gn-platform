import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 썸네일은 T-23 업로드가 돌려주는 Supabase 스토리지 공개 URL입니다.
    // 프로젝트 주소가 환경마다 달라 호스트를 와일드카드로 두되, 경로는 공개 오브젝트로 좁힙니다.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
