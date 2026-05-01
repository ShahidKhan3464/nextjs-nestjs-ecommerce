"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlistStore } from "@/store/wishlist-store";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ProductCard } from "@/modules/products/components/product-card";
import { fetchProducts } from "@/modules/products/services/products.service";

export function WishlistGrid() {
  const ids = useWishlistStore((s) => s.productIds);

  const { data, isPending } = useQuery({
    queryKey: [...queryKeys.products.all, "wishlist", ids.join(",")],
    queryFn: () => fetchProducts({ limit: 100, page: 1 }),
    enabled: ids.length > 0,
  });

  if (ids.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on a product to save it here."
      />
    );
  }

  if (isPending || !data) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-4/5 rounded-xl" />
        ))}
      </div>
    );
  }

  const items = data.data.filter((p) => ids.includes(p.id));

  if (items.length === 0) {
    return (
      <EmptyState title="Nothing to show" description="Try adding products again." />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
