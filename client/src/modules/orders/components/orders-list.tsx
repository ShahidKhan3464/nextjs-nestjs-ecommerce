"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { fetchOrders } from "@/modules/orders/services/orders.service";

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "default",
  pending: "outline",
  shipped: "secondary",
  delivered: "secondary",
  cancelled: "destructive",
};

export function OrdersList() {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: fetchOrders,
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place an order, it will appear here."
        action={
          <Link
            href={ROUTES.products}
            className={cn(buttonVariants())}
          >
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <ul className="space-y-4">
      {data.map((order) => (
        <li key={order.id}>
          <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium tabular-nums">#{order.id}</p>
                <Badge variant={statusVariant[order.status] ?? "outline"}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {format(new Date(order.createdAt), "MMM d, yyyy")}
              </p>
              <p className="text-muted-foreground text-sm">
                {order.items.length} item
                {order.items.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-semibold tabular-nums">
                ${order.total.toFixed(2)}
              </p>
              <Link
                href={ROUTES.order(order.id)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                Details
              </Link>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
