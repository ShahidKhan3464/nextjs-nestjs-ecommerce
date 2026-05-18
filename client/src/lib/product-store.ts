import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

let cache: Product[] | null = null;

export function getProductCatalog(): Product[] {
  if (!cache) {
    cache = structuredClone(MOCK_PRODUCTS);
  }
  return cache;
}

export function findVariant(product: Product, variantId: string) {
  return product.variants.find((v) => v.id === variantId);
}
