"use client";

import { motion } from "framer-motion";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ProductCard } from "@/modules/products/components/product-card";
import { useProductSearchParams } from "@/modules/products/hooks/use-product-search-params";
import {
  fetchProducts,
  type ProductListParams,
} from "@/modules/products/services/products.service";

function toParams(values: ReturnType<typeof useProductSearchParams>["values"]): ProductListParams {
  return {
    q: values.q || undefined,
    category: values.category || undefined,
    maxPrice: values.maxPrice ? Number(values.maxPrice) : undefined,
    minRating: values.minRating ? Number(values.minRating) : undefined,
    sort: values.sort,
    page: values.page,
    limit: 12,
  };
}

export function ProductListing() {
  const { values, setParams } = useProductSearchParams();
  const params = toParams(values);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.products.list(params as unknown as Record<string, unknown>),
    queryFn: () => fetchProducts(params),
    placeholderData: (prev) => prev,
  });

  if (isPending && !data) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Could not load products"
        description="Please try again in a moment."
        action={
          <Button type="button" onClick={() => void refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  const { data: items, pagination } = data;

  if (items.length === 0) {
    return (
      <EmptyState
        title="No matches"
        description="Adjust filters or search for something else."
      />
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={pagination.page <= 1}
          onClick={() => setParams({ page: pagination.page - 1 })}
        >
          Previous
        </Button>
        <span className="text-muted-foreground text-sm tabular-nums">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setParams({ page: pagination.page + 1 })}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
