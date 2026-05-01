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
import { fetchOrder } from "@/modules/orders/services/orders.service";
import { EmptyState } from "@/shared/components/feedback/empty-state";

type Props = {
  orderId: string;
};

export function OrderDetailView({ orderId }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => fetchOrder(orderId),
  });

  if (isPending) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Order not found"
        description="This order may not exist or you may not have access."
        action={
          <Link
            href={ROUTES.orders}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to orders
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 lg:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Order</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            #{data.id}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Placed {format(new Date(data.createdAt), "MMM d, yyyy HH:mm")}
          </p>
        </div>
        <Badge>{data.status}</Badge>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide uppercase">Items</h2>
        <ul className="divide-y rounded-xl border">
          {data.items.map((item) => (
            <li
              key={`${item.variantId}-${item.priceAtPurchase}`}
              className="flex gap-4 p-4"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image && (
                  <Image
                    fill
                    alt=""
                    sizes="64px"
                    src={item.image}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-muted-foreground text-sm">
                  {item.variantLabel} × {item.quantity}
                </p>
                <p className="text-muted-foreground text-xs">
                  Price at purchase: ${item.priceAtPurchase.toFixed(2)} each
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

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 text-sm">
          <h2 className="font-medium tracking-wide uppercase">Shipping</h2>
          <p className="text-muted-foreground leading-relaxed">
            {data.shippingAddress.fullName}
            <br />
            {data.shippingAddress.line1}
            {data.shippingAddress.line2 && (
              <>
                <br />
                {data.shippingAddress.line2}
              </>
            )}
            <br />
            {data.shippingAddress.city}, {data.shippingAddress.region}{" "}
            {data.shippingAddress.postalCode}
            <br />
            {data.shippingAddress.country}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h2 className="font-medium tracking-wide uppercase">Payment</h2>
          <p className="text-muted-foreground">{data.paymentMethodSummary}</p>
          {data.couponCode && (
            <p className="text-muted-foreground">
              Coupon <span className="text-foreground">{data.couponCode}</span>
            </p>
          )}
          <div className="space-y-1 border-t pt-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="tabular-nums">-${data.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="tabular-nums">${data.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="tabular-nums">${data.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      <Link
        href={ROUTES.orders}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        All orders
      </Link>
    </div>
  );
}
