type OrderStatus = "paid" | "pending" | "shipped" | "delivered" | "cancelled";

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
  createdAt: string;
  orderNumber: string;
  status: OrderStatus;
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

export type CreateCheckoutInput = {
  shippingAddress: Address;
};

export type CheckoutPreview = {
  tax: number;
  total: number;
  subtotal: number;
};

export type CheckoutSession = {
  clientSecret: string;
  paymentIntentId: string;
  preview: CheckoutPreview;
  checkoutSessionId: string;
};

export type CompleteCheckoutInput = {
  paymentIntentId: string;
};
