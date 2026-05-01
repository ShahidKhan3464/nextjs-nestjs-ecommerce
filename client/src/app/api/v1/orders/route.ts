import { z } from "zod";
import { MOCK_COUPONS } from "@/lib/mock-data";
import { requireUser } from "@/lib/require-auth";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import { listOrdersForUser, pushOrder } from "@/lib/order-memory";
import { findVariant, getProductCatalog } from "@/lib/product-store";
import type { Address, ApiResponse, Order, OrderLineItem } from "@/types";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productSlug: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    line1: z.string().min(2),
    line2: z.string().optional(),
    city: z.string().min(1),
    region: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(2),
    phone: z.string().optional(),
  }),
  payment: z.object({
    method: z.enum(["card", "paypal"]),
    summary: z.string().min(1),
  }),
  couponCode: z.string().optional(),
});

export async function GET(req: Request) {
  const user = await requireUser(req);
  if (user instanceof Response) return user;
  const list = listOrdersForUser(user.id);
  const body: ApiResponse<{ orders: Order[] }> = { data: { orders: list } };
  return jsonOk(body);
}

export async function POST(req: Request) {
  const user = await requireUser(req);
  if (user instanceof Response) return user;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }
  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return jsonMessage("Invalid checkout payload", 422);
  }
  const { items, shippingAddress, payment, couponCode } = parsed.data;

  const lineItems: OrderLineItem[] = [];
  let subtotal = 0;

  for (const line of items) {
    const product = getProductCatalog().find((p) => p.slug === line.productSlug);
    if (!product) {
      return jsonMessage(`Product not found: ${line.productSlug}`, 400);
    }
    const variant = findVariant(product, line.variantId);
    if (!variant) {
      return jsonMessage(`Variant not found on product ${product.slug}`, 400);
    }
    if (line.quantity > variant.stock) {
      return jsonMessage(`Insufficient stock for ${variant.sku}`, 409);
    }
    const lineTotal = variant.price * line.quantity;
    subtotal += lineTotal;
    lineItems.push({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      variantLabel: variant.name,
      quantity: line.quantity,
      priceAtPurchase: variant.price,
      image: variant.image ?? product.images[0],
    });
  }

  let discount = 0;
  let appliedCoupon: string | undefined;
  if (couponCode?.trim()) {
    const code = couponCode.trim().toUpperCase();
    const coupon = MOCK_COUPONS.find((c) => c.code === code);
    if (coupon) {
      if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
        return jsonMessage("Coupon minimum subtotal not met", 400);
      }
      if (coupon.type === "percent") {
        discount = Math.round(subtotal * (coupon.value / 100) * 100) / 100;
      } else {
        discount = Math.min(coupon.value, subtotal);
      }
      appliedCoupon = coupon.code;
    }
  }

  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * 0.08 * 100) / 100;
  const shipping = taxable >= 150 ? 0 : 12;
  const total = Math.round((taxable + tax + shipping) * 100) / 100;

  const order: Order = {
    id: `ord_${crypto.randomUUID().slice(0, 8)}`,
    userId: user.id,
    status: "paid",
    items: lineItems,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    couponCode: appliedCoupon,
    shippingAddress: shippingAddress as Address,
    paymentMethodSummary: payment.summary,
    createdAt: new Date().toISOString(),
  };

  pushOrder(user.id, order);

  const body: ApiResponse<{ order: Order }> = { data: { order } };
  return jsonOk(body, { status: 201 });
}
