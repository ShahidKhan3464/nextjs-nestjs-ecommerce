import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../constants/order.constants';
import { ProductVariant } from 'src/products/entities/product-variant.entity';

export type OrderAddress = {
  city: string;
  line1: string;
  line2?: string;
  region: string;
  phone?: string;
  country: string;
  fullName: string;
  postalCode: string;
};

export type OrderLineItemResponse = {
  image?: string;
  quantity: number;
  variantId: string;
  productId: string;
  productName: string;
  variantLabel: string;
  priceAtPurchase: number;
};

export type OrderResponse = {
  id: string;
  tax: number;
  total: number;
  userId: string;
  status: string;
  subtotal: number;
  createdAt: string;
  orderNumber: string;
  paymentMethodSummary: string;
  shippingAddress: OrderAddress;
  items: OrderLineItemResponse[];
};

function formatVariantLabel(variant: ProductVariant): string {
  const parts = [variant.size, variant.color].filter(
    (p) => typeof p === 'string' && p.trim().length > 0,
  );
  return parts.length > 0 ? parts.join(' / ') : variant.sku;
}

function parseShippingAddress(raw: string): OrderAddress {
  try {
    return JSON.parse(raw) as OrderAddress;
  } catch {
    return {
      city: '',
      line1: raw,
      region: '',
      country: '',
      fullName: '',
      postalCode: '',
    };
  }
}

function mapStatus(status: OrderStatus): string {
  return status.toLowerCase();
}

function mapOrderItem(item: OrderItem): OrderLineItemResponse {
  const variant = item.variant;
  const product = variant?.product;
  const image =
    product?.images?.[0]?.urlPath ??
    (product?.images?.length ? product.images[0].urlPath : undefined);

  return {
    quantity: item.quantity,
    image: image || undefined,
    variantId: String(item.variantId),
    productName: product?.name ?? 'Product',
    productId: product ? String(product.id) : '',
    priceAtPurchase: Number(item.priceAtPurchase),
    variantLabel: variant ? formatVariantLabel(variant) : '',
  };
}

export function mapOrderToResponse(order: Order): OrderResponse {
  return {
    id: String(order.id),
    tax: Number(order.tax),
    userId: String(order.userId),
    orderNumber: order.orderNumber,
    status: mapStatus(order.status),
    subtotal: Number(order.subtotal),
    total: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    items: (order.items ?? []).map(mapOrderItem),
    paymentMethodSummary: order.paymentMethodSummary ?? 'Card',
    shippingAddress: parseShippingAddress(order.shippingAddress),
  };
}

export function generateOrderNumber(): string {
  const date = new Date();
  const ymd = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('');
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${ymd}-${suffix}`;
}
