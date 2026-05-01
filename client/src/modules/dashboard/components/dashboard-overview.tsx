"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { queryKeys } from "@/constants/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { fetchOrders } from "@/modules/orders/services/orders.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardOverview() {
  const user = useAuthStore((s) => s.user);
  const { data, isPending } = useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: fetchOrders,
  });

  const revenue =
    data?.reduce((s, o) => s + o.total, 0) ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Hello{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          A quick snapshot of your spending and recent orders with us.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total spend</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-semibold tabular-nums">
                ${revenue.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-semibold tabular-nums">
                {data?.length ?? 0}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link
              href={ROUTES.orders}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View orders
            </Link>
            <Link
              href={ROUTES.products}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Continue shopping
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
