type OrderStatus =
  | "paid"
  | "pending"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderLineItem = {
  image?: string;
  quantity: number;
  variantId: string;
  productId: string;
  productName: string;
  variantLabel: string;
  priceAtPurchase: number;
};

export type Order = {
  id: string;
  tax: number;
  total: number;
  userId: string;
  subtotal: number;
  shipping: number;
  discount: number;
  createdAt: string;
  status: OrderStatus;
  couponCode?: string;
  items: OrderLineItem[];
  shippingAddress: Address;
  paymentMethodSummary: string;
};

export type Address = {
  id?: string;
  city: string;
  line1: string;
  line2?: string;
  phone?: string;
  region: string;
  country: string;
  fullName: string;
  postalCode: string;
};
