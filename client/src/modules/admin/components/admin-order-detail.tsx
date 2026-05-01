"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { fetchAdminOrder } from "@/modules/admin/services/admin.service";

type Props = { orderId: string };

export function AdminOrderDetail({ orderId }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.order(orderId),
    queryFn: () => fetchAdminOrder(orderId),
  });

  if (isPending) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Order not found"
        action={
          <Link
            href={ROUTES.adminOrders}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            All orders
          </Link>
        }
      />
    );
  }

  const { order, customerUserId } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Order</p>
          <h2 className="font-heading text-2xl font-semibold tabular-nums">
            #{order.id}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {format(new Date(order.createdAt), "PPpp")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge>{order.status}</Badge>
          <Link
            href={ROUTES.adminUser(customerUserId)}
            className="text-primary text-sm hover:underline"
          >
            Customer: {customerUserId}
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide uppercase">Items</h3>
        <ul className="divide-y rounded-xl border">
          {order.items.map((item) => (
            <li key={`${item.variantId}-${item.priceAtPurchase}`} className="flex gap-4 p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image && (
                  <Image
                    alt=""
                    fill
                    sizes="64px"
                    src={item.image}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-muted-foreground text-sm">
                  {item.variantLabel} × {item.quantity}
                </p>
                <p className="text-muted-foreground text-xs">
                  Snapshot ${item.priceAtPurchase.toFixed(2)} each
                </p>
              </div>
              <p className="tabular-nums">
                ${(item.priceAtPurchase * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 text-sm">
          <h3 className="font-medium tracking-wide uppercase">Shipping</h3>
          <p className="text-muted-foreground leading-relaxed">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.region}{" "}
            {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="font-medium tracking-wide uppercase">Totals</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="tabular-nums">-${order.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="tabular-nums">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="tabular-nums">${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">${order.total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Payment: {order.paymentMethodSummary}
          </p>
        </div>
      </div>

      <Link
        href={ROUTES.adminOrders}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        All orders
      </Link>
    </div>
  );
}
