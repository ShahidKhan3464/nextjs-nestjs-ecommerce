"use client";

import { ProductFilters } from "@/modules/products/components/product-filters";
import { ProductListing } from "@/modules/products/components/product-listing";

export function ProductsPageContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-10 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Shop
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          Search by name, narrow by category or price, and browse the collection
          at your own pace.
        </p>
      </header>
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductFilters />
        </aside>
        <div>
          <ProductListing />
        </div>
      </div>
    </div>
  );
}
