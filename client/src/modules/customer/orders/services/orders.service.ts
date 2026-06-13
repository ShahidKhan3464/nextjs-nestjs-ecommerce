import { api } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  Order,
  CheckoutSession,
  OrderListParams,
  CancelOrderInput,
  CreateCheckoutInput,
  CompleteCheckoutInput,
} from "../types";

function toQueryParams(params?: OrderListParams) {
  if (!params) return undefined;
  const query: Record<string, string> = {};
  if (params.status) query.status = params.status.toUpperCase();
  if (params.paymentStatus) query.paymentStatus = params.paymentStatus.toUpperCase();
  return Object.keys(query).length > 0 ? query : undefined;
}

export async function fetchOrders(params?: OrderListParams) {
  const res = await api.get<ApiResponse<{ orders: Order[] }>>(
    "/api/v1/customer/orders",
    { params: toQueryParams(params) }
  );
  return res.data.data.orders;
}

export async function fetchOrder(id: string) {
  const res = await api.get<ApiResponse<{ order: Order }>>(
    `/api/v1/customer/orders/${id}`
  );
  return res.data.data.order;
}

export async function createCheckout(body: CreateCheckoutInput) {
  const res = await api.post<ApiResponse<CheckoutSession>>(
    "/api/v1/customer/orders/checkout",
    body
  );
  return res.data.data;
}

export async function cancelCheckout(paymentIntentId: string) {
  await api.post("/api/v1/customer/orders/checkout/cancel", {
    paymentIntentId,
  });
}

export async function completeCheckout(body: CompleteCheckoutInput) {
  const res = await api.post<ApiResponse<{ order: Order }>>(
    "/api/v1/customer/orders/checkout/complete",
    body
  );
  return res.data.data.order;
}

export async function cancelOrder(id: string, body: CancelOrderInput) {
  const res = await api.post<ApiResponse<{ order: Order }>>(
    `/api/v1/customer/orders/${id}/cancel`,
    body
  );
  return res.data.data.order;
}
