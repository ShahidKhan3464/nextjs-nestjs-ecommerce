import { api } from "@/services/api/client";
import type { Product, ProductListParams } from "../types";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export async function fetchProducts(params: ProductListParams) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  const res = await api.get<PaginatedResponse<Product>>(
    `/api/v1/products?${search.toString()}`
  );
  return res.data;
}

export async function fetchProductBySlug(slug: string) {
  const res = await api.get<ApiResponse<Product>>(`/api/v1/products/${slug}`);
  return res.data.data;
}
