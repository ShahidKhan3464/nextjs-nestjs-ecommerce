import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

let cache: Product[] | null = null;

export function getProductCatalog(): Product[] {
  if (!cache) {
    cache = structuredClone(MOCK_PRODUCTS);
  }
  return cache;
}

export function findProductBySlug(slug: string): Product | undefined {
  return getProductCatalog().find((p) => p.slug === slug);
}

export function findVariant(product: Product, variantId: string) {
  return product.variants.find((v) => v.id === variantId);
}

export function upsertProduct(product: Product) {
  const list = getProductCatalog();
  const i = list.findIndex((p) => p.id === product.id);
  if (i >= 0) {
    list[i] = product;
  } else {
    list.push(product);
  }
}

export function deleteProductById(id: string): boolean {
  const list = getProductCatalog();
  const i = list.findIndex((p) => p.id === id);
  if (i === -1) return false;
  list.splice(i, 1);
  return true;
}
