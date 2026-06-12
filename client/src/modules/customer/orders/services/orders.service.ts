import { api } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  Order,
  CheckoutSession,
  CreateCheckoutInput,
  CompleteCheckoutInput,
} from "../types";

export async function fetchOrders(params?: { status?: string }) {
  const res = await api.get<ApiResponse<{ orders: Order[] }>>(
    "/api/v1/customer/orders",
    {
      params: params?.status
        ? { status: params.status.toUpperCase() }
        : undefined,
    }
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
