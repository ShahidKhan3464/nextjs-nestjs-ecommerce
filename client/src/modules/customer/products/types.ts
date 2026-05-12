export type { PaginatedResponse } from "@/types/api";

export type ProductListParams = {
  q?: string;
  page?: number;
  sort?: string;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  productId: string;
  compareAtPrice?: number;
  options: Record<string, string>;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  category: string;
  images: string[];
  featured?: boolean;
  description: string;
  reviewCount: number;
  variants: ProductVariant[];
};
