import type { Product, ProductVariant } from "@/types";

/** Backend product shape (relations loaded). Keep loose to track API drift. */
export type NestProductDto = {
  id: number;
  name: string;
  description?: string | null;
  status?: string;
  category?: { id: number; name: string };
  variants?: NestVariantDto[];
  images?: NestProductImageDto[];
};

type NestProductImageDto = {
  id: number;
  urlPath: string;
  sortOrder: number;
};

type NestVariantDto = {
  id: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  price: string | number;
};

function getCatalogImageBase(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    "http://localhost:3001"
  ).replace(/\/$/, "");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function mapNestProductToAdminProduct(p: NestProductDto): Product {
  const base = getCatalogImageBase();
  const rawImages = (p.images ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => `${base}${img.urlPath}`);
  const images =
    rawImages.length > 0
      ? rawImages
      : [`https://picsum.photos/seed/product-${p.id}/80/80`];

  const variants: ProductVariant[] = (p.variants ?? []).map((v) => ({
    id: String(v.id),
    productId: String(p.id),
    sku: v.sku,
    name: `${v.size} / ${v.color}`,
    options: { size: v.size, color: v.color },
    price: Number(v.price),
    stock: v.stock,
  }));

  const basePrice =
    variants.length > 0
      ? Math.min(...variants.map((v) => v.price))
      : 0;

  return {
    id: String(p.id),
    slug: `${slugify(p.name)}-${p.id}`,
    name: p.name,
    description: p.description ?? "",
    category: p.category?.name ?? "",
    rating: 0,
    reviewCount: 0,
    images,
    variants,
    basePrice,
    featured: false,
  };
}
