import { api } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";
import type { Order, PlaceOrderInput } from "../types";

export async function fetchOrders() {
  const res = await api.get<ApiResponse<{ orders: Order[] }>>("/api/v1/orders");
  return res.data.data.orders;
}

export async function fetchOrder(id: string) {
  const res = await api.get<ApiResponse<{ order: Order }>>(
    `/api/v1/orders/${id}`
  );
  return res.data.data.order;
}

export async function placeOrder(body: PlaceOrderInput) {
  const res = await api.post<ApiResponse<{ order: Order }>>(
    "/api/v1/orders",
    body
  );
  return res.data.data.order;
}
