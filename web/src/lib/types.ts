export type RepairService = {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  longDescription: string;
  symptoms: string[];
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
  address: string;
};
