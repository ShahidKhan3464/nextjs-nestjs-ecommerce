import { jsonOk } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-auth";
import { allOrdersFlat } from "@/lib/order-memory";
import { getProductCatalog } from "@/lib/product-store";
import { eachDayOfInterval, format, subDays } from "date-fns";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const products = getProductCatalog();
  const orders = allOrdersFlat();
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
      totals: {
        revenue,
        orders: orders.length,
        products: products.length,
        variants: products.reduce((s, p) => s + p.variants.length, 0),
      },
      revenueByDay,
      lowStock,
    },
  });
}
