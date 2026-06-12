import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/backend-url";
import type { PaginatedResponse } from "@/types/api";
import { Hero } from "@/shared/components/marketing/hero";
import type { Product } from "@/modules/customer/products/types";
import { ProductCard } from "@/modules/customer/products/components/product-card";
import { RecentlyViewedStrip } from "@/modules/customer/products/components/recently-viewed-strip";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${getSiteUrl()}/api/v1/customer/products?limit=4&page=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const body = (await res.json()) as PaginatedResponse<Product>;
    return body.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await fetchFeaturedProducts();

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <RecentlyViewedStrip />
        <div className="mb-10 space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            New arrivals
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Fresh picks from our catalog—curated essentials with intentional
            design.
          </p>
        </div>
        {featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Products will appear here once they are added to the catalog.
          </p>
        )}
      </section>
    </>
  );
}
