export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string; // ISO 8601 string
  sessionId?: string;
  whyWanted?: string;
}
