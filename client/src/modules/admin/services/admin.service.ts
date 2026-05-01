import { api } from "@/services/api/client";
import type { Order, Product, User } from "@/types";

export type AdminAnalytics = {
  totals: {
    orders: number;
    revenue: number;
    products: number;
    variants: number;
  };
  revenueByDay: { date: string; revenue: number }[];
  lowStock: { sku: string; product: string; stock: number }[];
};

export async function fetchAdminAnalytics() {
  const res = await api.get<{ data: AdminAnalytics }>(
    "/api/v1/admin/analytics"
  );
  return res.data.data;
}

export async function fetchAdminProducts() {
  const res = await api.get<{ data: { products: Product[] } }>(
    "/api/v1/admin/products"
  );
  return res.data.data.products;
}

export async function upsertAdminProduct(product: Product) {
  const exists = await fetchAdminProducts().then((list) =>
    list.some((p) => p.id === product.id)
  );
  if (exists) {
    await api.put(`/api/v1/admin/products/${product.id}`, product);
  } else {
    await api.post("/api/v1/admin/products", product);
  }
}

export async function deleteAdminProduct(id: string) {
  await api.delete(`/api/v1/admin/products/${id}`);
}

export async function fetchAdminUsers() {
  const res = await api.get<{ data: { users: User[] } }>("/api/v1/admin/users");
  return res.data.data.users;
}

export async function fetchAdminUser(id: string) {
  const res = await api.get<{ data: { user: User } }>(
    `/api/v1/admin/users/${id}`
  );
  return res.data.data.user;
}

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

export async function createAdminProduct(product: Product) {
  await api.post("/api/v1/admin/products", product);
}
