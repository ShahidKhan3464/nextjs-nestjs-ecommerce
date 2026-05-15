"use client";

import { ProductFilters } from "./product-filters";
import { ProductListing } from "./product-listing";

export function ProductsPageContent() {
  return (
    <div className="space-y-4">
      <header className="space-y-0.5">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Products
        </h1>
        <p className="text-muted-foreground text-sm">
          Browse our catalog and find the perfect product for you.
        </p>
      </header>
      <ProductFilters />
      <ProductListing />
    </div>
  );
}
