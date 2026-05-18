import { slugify } from "@/lib/slugify";
import { getBackendUrl } from "@/lib/backend-url";
import type { Product } from "@/modules/customer/products/types";
import { formatVariantNameFromNest } from "@/modules/customer/products/lib/variant-label";

export type NestProductPayload = {
  id: number;
  name: string;
  rating: number;
  status?: string;
  featured: boolean;
  slug: string | null;
  description: string;
  reviewCount: number;
  basePrice: string | number;
  category: {
    id: number;
    name: string;
  };
  variants: {
    sku: string;
    size?: string;
    stock: number;
    color?: string;
    id: number | string;
    price: string | number;
  }[];
  images: string[] | { id: number; urlPath: string; sortOrder?: number }[];
};

export function normalizeNestProductPayload(p: NestProductPayload): Product {
  const backend = getBackendUrl();

  const images: string[] = (p.images ?? [])
    .map((img) => {
      if (typeof img === "string") return img;
      if (img && typeof img === "object" && "urlPath" in img && img.urlPath) {
        return `${backend}${img.urlPath}`;
      }
      return null;
    })
    .filter((url): url is string => !!url);

  const slug = p.slug ?? `${slugify(p.name)}-${p.id}`;

  const variants = (p.variants ?? []).map((v) => ({
    id: String(v.id),
    productId: String(p.id),
    sku: v.sku,
    name: formatVariantNameFromNest(v),
    options: {
      ...(v.size ? { size: v.size } : {}),
      ...(v.color ? { color: v.color } : {}),
    },
    price: Number(v.price),
    stock: v.stock,
  }));

  return {
    slug,
    images,
    variants,
    name: p.name,
    id: String(p.id),
    rating: p.rating,
    featured: p.featured,
    category: p.category.name,
    description: p.description,
    reviewCount: p.reviewCount,
    basePrice: Number(p.basePrice),
  };
}
