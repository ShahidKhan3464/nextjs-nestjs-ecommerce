export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  options: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  featured?: boolean;
}

export interface Address {
  id?: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderLineItem {
  variantId: string;
  productId: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  /** Snapshot at purchase */
  priceAtPurchase: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingAddress: Address;
  paymentMethodSummary: string;
  createdAt: string;
}

export interface CartItem {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  variantLabel: string;
  price: number;
  quantity: number;
  image: string;
  maxQty: number;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  expiresAt?: string;
}
