import { api } from "@/services/api/client";
import type { CreateAdminProductInput } from "../types";
import type { Product } from "@/modules/customer/products/types";

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
  return res.data.data;
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
