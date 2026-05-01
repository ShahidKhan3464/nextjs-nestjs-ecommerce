import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Hero } from "@/shared/components/marketing/hero";
import { ProductCard } from "@/modules/products/components/product-card";
import { RecentlyViewedStrip } from "@/modules/products/components/recently-viewed-strip";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

export default function HomePage() {
  const featured = MOCK_PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <RecentlyViewedStrip />
        <div className="mb-10 space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Featured right now
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Static marketing shell with ISR-powered product cards — connect{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              NEXT_PUBLIC_SITE_URL
            </code>{" "}
            for accurate absolute fetches in deployment.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
