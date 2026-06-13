import type { Order } from "../types";
import { api } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";

export async function fetchAdminOrders(params?: { status?: string }) {
  const res = await api.get<ApiResponse<{ orders: Order[] }>>(
    "/api/v1/admin/orders",
    {
      params: params?.status
        ? { status: params.status.toUpperCase() }
        : undefined,
    }
  );
  return res.data.data.orders;
}

export async function fetchAdminOrder(id: string) {
  const res = await api.get<
    ApiResponse<{ order: Order; customerUserId: string }>
  >(`/api/v1/admin/orders/${id}`);
  return res.data.data;
}

export async function updateAdminOrderStatus(
  id: string,
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  const res = await api.patch<ApiResponse<{ order: Order }>>(
    `/api/v1/admin/orders/${id}/status`,
    { status }
  );
  return res.data.data.order;
}
