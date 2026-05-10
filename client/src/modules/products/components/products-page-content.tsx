"use client";

import { ProductFilters } from "@/modules/products/components/product-filters";
import { ProductListing } from "@/modules/products/components/product-listing";

export function ProductsPageContent() {
  return (
    <div className="space-y-8">
      <ProductFilters />
      <ProductListing />
    </div>
  );
}
