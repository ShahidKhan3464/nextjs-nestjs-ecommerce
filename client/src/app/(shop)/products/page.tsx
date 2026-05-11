import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { getAccessTokenPayload } from "@/lib/session-cookie";
import { AdminProductsList } from "@/modules/admin/products";
import { ProductsPageContent } from "@/modules/products/components/products-page-content";

export const metadata: Metadata = {
  title: "Products",
  description: `Browse products — ${siteConfig.name}`,
};

function ProductsFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="mb-8 h-10 w-48" />
      <Skeleton className="mb-8 h-40 w-full rounded-xl" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-4/5 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function ProductsPage() {
  const session = await getAccessTokenPayload();

  if (session?.role === "admin") {
    return (
      <div className="space-y-4">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Products
            </h1>
            <p className="text-muted-foreground text-sm">
              Maintain your catalog—search inventory, refresh data, and add new
              listings when you are ready.
            </p>
          </div>
          <div>
            <Link
              href={ROUTES.productNew}
              className={cn(buttonVariants({ size: "default" }))}
            >
              Add product
            </Link>
          </div>
        </header>
        <AdminProductsList />
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
