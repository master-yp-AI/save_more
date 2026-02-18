// 省点吧应用类型定义

export interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  slashCount: number; // 被劝一刀的次数
  category: string;
  description: string;
  isHot?: boolean; // 是否为"热门"（最不值得买）
  couponCount?: number; // 可领券数量
  soldCount?: number; // 已售数量
}

export interface SlashRecord {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  priceIncrease: number;
  comment: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  meritPoints: number; // 功德值
  achievements: Achievement[];
  blacklist: string[]; // 黑名单商品ID
  favorites: string[]; // 收藏商品ID
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface DissuasionPost {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  status: 'active' | 'dissuaded' | 'purchased';
  timestamp: number;
  dissuasionCount: number;
}

export interface DesertProgress {
  grassCount: number; // 剩余草数量
  totalGrass: number; // 总草数量
  daysWithoutShopping: number; // 连续未购物天数
  lastCheckIn: number; // 最后签到时间
}

export interface GuiltStats {
  totalWasted: number; // 总浪费金额
  cartValue: number; // 购物车总价值
  equivalentMeals: number; // 相当于多少顿饭
  equivalentRetirementDays: number; // 相当于退休后多少天的生活费
}
