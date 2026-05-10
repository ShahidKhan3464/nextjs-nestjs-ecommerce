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

export type AdminCategoryOption = {
  id: number;
  name: string;
  description?: string | null;
};

export type CreateAdminProductInput = {
  categoryId: number;
  name: string;
  description?: string;
  variants: {
    size: string;
    color: string;
    sku: string;
    stock: number;
    price: number;
  }[];
  images: File[];
};

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  /* Dashboard analytics API not wired to Nest yet — avoid failing requests.
  const res = await api.get<{ data: AdminAnalytics }>(
    "/api/v1/admin/analytics"
  );
  return res.data.data;
  */
  return {
    totals: { orders: 0, revenue: 0, products: 0, variants: 0 },
    revenueByDay: [],
    lowStock: [],
  };
}

export async function fetchAdminCategories(params?: {
  limit?: number;
  search?: string;
}) {
  const res = await api.get<{
    data: {
      categories: AdminCategoryOption[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  }>("/api/v1/categories", {
    params: {
      limit: params?.limit ?? 100,
      page: 1,
      ...(params?.search ? { search: params.search } : {}),
    },
  });
  return res.data.data.categories;
}

export async function fetchAdminProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}) {
  const res = await api.get<{
    data: {
      products: Product[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  }>("/api/v1/admin/products", { params });
  return res.data.data.products;
}

export async function createAdminProduct(payload: CreateAdminProductInput) {
  const fd = new FormData();
  fd.append("categoryId", String(payload.categoryId));
  fd.append("name", payload.name);
  if (payload.description?.trim()) {
    fd.append("description", payload.description.trim());
  }
  fd.append("variants", JSON.stringify(payload.variants));
  for (const file of payload.images) {
    fd.append("images", file);
  }
  await api.post("/api/v1/admin/products", fd);
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
