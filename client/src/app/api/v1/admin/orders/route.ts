import type { Order } from "@/types";
import type { ApiResponse } from "@/types";
import { jsonOk } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-auth";
import { allOrdersFlat } from "@/lib/order-memory";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const orders = [...allOrdersFlat()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const body: ApiResponse<{ orders: Order[] }> = { data: { orders } };
  return jsonOk(body);
}
