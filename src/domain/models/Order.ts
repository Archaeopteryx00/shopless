export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  whyWanted?: string;
}

export interface Order {
  id: string; // e.g. "SL-28391"
  createdAt: string; // ISO 8601 string
  sessionId?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddressName: string;
  paymentMethodName: string;
  deliveredAt?: string;
}
