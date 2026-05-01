import type { Order } from "@/types";
import type { ApiResponse } from "@/types";
import { requireAdmin } from "@/lib/require-auth";
import { findOrderWithUser } from "@/lib/order-memory";
import { jsonMessage, jsonOk } from "@/lib/api-response";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  const found = findOrderWithUser(id);
  if (!found) {
    return jsonMessage("Order not found", 404);
  }
  const body: ApiResponse<{
    order: Order;
    customerUserId: string;
  }> = {
    data: {
      order: found.order,
      customerUserId: found.userId,
    },
  };
  return jsonOk(body);
}
