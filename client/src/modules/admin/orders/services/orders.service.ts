import type { Order } from "../types";
import { api } from "@/services/api/client";

export async function fetchAdminOrders() {
  const res = await api.get<{ data: { orders: Order[] } }>(
    "/api/v1/admin/orders"
  );
  return res.data.data.orders;
}

export async function fetchAdminOrder(id: string) {
  const res = await api.get<{
    data: { order: Order; customerUserId: string };
  }>(`/api/v1/admin/orders/${id}`);
  return res.data.data;
}
