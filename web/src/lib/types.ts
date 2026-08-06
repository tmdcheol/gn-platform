export type RepairService = {
  id: number;
  title: string;
  description: string;
  icon: string;
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
