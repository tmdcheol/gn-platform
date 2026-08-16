export type RepairService = {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  longDescription: string;
  symptoms: string[];
  /** 지역+서비스 쿼리를 노리는 서비스인지. 전국 픽업·견인은 false. */
  regional: boolean;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  author: string;
  vehicleType: string;
  rating: number;
  content: string;
};

export type Contact = {
  phone: string;
  callCenter: string[];
  kakaoOpenChatUrl: string;
  /** 화면에 그대로 노출하는 한 줄 주소. */
  address: string;
  /** 구조화 데이터용으로 쪼갠 주소. */
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  /** 영업시간. 휴무일은 항목 자체가 없습니다. */
  businessHours: BusinessHours[];
};

export type BusinessHours = {
  /** schema.org DayOfWeek 값(Monday, Saturday …) */
  days: string[];
  opens: string;
  closes: string;
};
