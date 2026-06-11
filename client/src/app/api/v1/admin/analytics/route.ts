import { getBackendUrl } from "@/lib/backend-url";
import { requireAdmin } from "@/lib/require-auth";
import { jsonOk, jsonMessage } from "@/lib/api-response";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { nestErrorMessage, forwardAuthorization } from "@/lib/nest-http";
import {
  type NestOrderPayload,
  normalizeNestOrderPayload,
} from "@/lib/nest-order-mapper";
import {
  type NestProductDto,
  mapNestProductToAdminProduct,
} from "@/lib/nest-catalog-mapper";

type NestPagedEnvelope = {
  data?: {
    total?: number;
    data?: NestProductDto[];
  };
};

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const backend = getBackendUrl();
  const authHeaders = forwardAuthorization(req);

  const [ordersRes, productsRes] = await Promise.all([
    fetch(`${backend}/orders/admin/all`, { headers: { ...authHeaders } }),
    fetch(`${backend}/products?limit=500`, { headers: { ...authHeaders } }),
  ]);

  let ordersRaw: unknown = null;
  let productsRaw: unknown = null;
  try {
    ordersRaw = await ordersRes.json();
  } catch {
    ordersRaw = null;
  }
  try {
    productsRaw = await productsRes.json();
  } catch {
    productsRaw = null;
  }

  if (!ordersRes.ok) {
    return jsonMessage(nestErrorMessage(ordersRaw), ordersRes.status);
  }
  if (!productsRes.ok) {
    return jsonMessage(nestErrorMessage(productsRaw), productsRes.status);
  }

  const ordersEnvelope = ordersRaw as { data?: NestOrderPayload[] };
  const orders = (ordersEnvelope?.data ?? []).map(normalizeNestOrderPayload);

  const productsEnvelope = productsRaw as NestPagedEnvelope;
  const productDtos = productsEnvelope?.data?.data ?? [];
  const products = productDtos.map(mapNestProductToAdminProduct);

  const revenue = orders.reduce((s, o) => s + o.total, 0);

  const end = new Date();
  const start = subDays(end, 6);
  const days = eachDayOfInterval({ start, end });

  const revenueByDay = days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const total = orders
      .filter((o) => format(new Date(o.createdAt), "yyyy-MM-dd") === key)
      .reduce((s, o) => s + o.total, 0);
    return { date: key, revenue: Math.round(total * 100) / 100 };
  });

  const lowStock = products
    .flatMap((p) =>
      p.variants.map((v) => ({
        sku: v.sku,
        product: p.name,
        stock: v.stock,
      }))
    )
    .filter((r) => r.stock < 6)
    .slice(0, 10);

  return jsonOk({
    data: {
      lowStock,
      revenueByDay,
      totals: {
        revenue,
        orders: orders.length,
        products: products.length,
        variants: products.reduce((s, p) => s + p.variants.length, 0),
      },
    },
  });
}
