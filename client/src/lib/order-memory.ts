import type { Order } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

const ordersByUser = new Map<string, Order[]>();

let seeded = false;

function seedDemoOrdersIfNeeded() {
  if (seeded) return;
  seeded = true;
  const p = MOCK_PRODUCTS[0];
  const v = p.variants[0];
  const tax = Math.round(v.price * 0.08 * 100) / 100;
  pushOrder("u2", {
    id: "ord_seed_1",
    userId: "u2",
    status: "delivered",
    items: [
      {
        variantId: v.id,
        productId: p.id,
        productName: p.name,
        variantLabel: v.name,
        quantity: 1,
        priceAtPurchase: v.price,
        image: p.images[0],
      },
    ],
    subtotal: v.price,
    tax,
    shipping: 0,
    discount: 0,
    total: v.price + tax,
    shippingAddress: {
      fullName: "Casey Customer",
      line1: "1 Market St",
      city: "San Francisco",
      region: "CA",
      postalCode: "94105",
      country: "US",
    },
    paymentMethodSummary: "Visa •••• 4242",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  });
}

export function listOrdersForUser(userId: string): Order[] {
  seedDemoOrdersIfNeeded();
  return ordersByUser.get(userId) ?? [];
}

export function findOrderForUser(
  userId: string,
  orderId: string
): Order | undefined {
  seedDemoOrdersIfNeeded();
  return listOrdersForUser(userId).find((o) => o.id === orderId);
}

export function pushOrder(userId: string, order: Order) {
  const list = ordersByUser.get(userId) ?? [];
  list.unshift(order);
  ordersByUser.set(userId, list);
}

export function allOrdersFlat(): Order[] {
  seedDemoOrdersIfNeeded();
  const out: Order[] = [];
  for (const list of ordersByUser.values()) {
    out.push(...list);
  }
  return out;
}

export function findOrderWithUser(
  orderId: string
): { order: Order; userId: string } | undefined {
  seedDemoOrdersIfNeeded();
  for (const [userId, list] of ordersByUser.entries()) {
    const found = list.find((o) => o.id === orderId);
    if (found) return { order: found, userId };
  }
  return undefined;
}
