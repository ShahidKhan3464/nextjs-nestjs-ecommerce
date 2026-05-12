"use client";

import { ProductFilters } from "./product-filters";
import { ProductListing } from "./product-listing";

export function ProductsPageContent() {
  return (
    <div className="space-y-8">
      <ProductFilters />
      <ProductListing />
    </div>
  );
}
