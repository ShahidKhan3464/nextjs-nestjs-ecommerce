export type { UserRole, User } from "@/modules/auth/types";
export type {
  Product,
  ProductVariant,
} from "@/modules/customer/products/types";
export type {
  Order,
  Address,
  OrderLineItem,
} from "@/modules/customer/orders/types";

export type Coupon = {
  code: string;
  value: number;
  expiresAt?: string;
  minSubtotal?: number;
  type: "percent" | "fixed";
};
