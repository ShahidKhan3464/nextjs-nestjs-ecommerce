import type { Order } from "@/types";
import type { ApiResponse } from "@/types";
import { requireUser } from "@/lib/require-auth";
import { findOrderForUser } from "@/lib/order-memory";
import { jsonMessage, jsonOk } from "@/lib/api-response";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(req);
  if (user instanceof Response) return user;
  const { id } = await ctx.params;
  const order = findOrderForUser(user.id, id);
  if (!order) {
    return jsonMessage("Order not found", 404);
  }
  const body: ApiResponse<{ order: Order }> = { data: { order } };
  return jsonOk(body);
}
