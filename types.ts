export type MetalType = 'Gold' | 'Silver' | 'Platinum';
export type CategoryType = 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  metal: MetalType;
  category: CategoryType;
  sizes?: string[];
  stock: number;
  created_at?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'pending'
  | 'processing'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  max_discount_amount?: number | null;
  is_active: boolean;
  expires_at?: string | null;
  usage_limit?: number | null;
  times_used: number;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
}
