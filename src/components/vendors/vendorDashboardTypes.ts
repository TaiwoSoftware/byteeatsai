export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  logo_url?: string;
  created_at: string;
}

export interface Food {
  id: string;
  name: string;
  price: number;
  details: string;
  vendor_id: string;
  image_url?: string;
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  created_at: string;
  items: OrderItem[] | string;
  order_status?: string;
}

export interface FoodAnalysis extends Food {
  orders: number;
  unitsSold: number;
  revenue: number;
  lastOrdered?: string;
}
