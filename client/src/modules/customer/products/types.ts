export type ProductListParams = {
  q?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  categoryId?: number;
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
  name: string;
  rating: number;
  category: string;
  images: string[];
  basePrice: number;
  featured?: boolean;
  description: string;
  reviewCount: number;
  slug: string | null;
  variants: ProductVariant[];
};
