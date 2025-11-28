
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
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
}
