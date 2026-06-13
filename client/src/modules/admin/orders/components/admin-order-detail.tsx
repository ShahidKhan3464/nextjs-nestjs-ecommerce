"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { queryKeys } from "@/constants/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api-error";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  fetchAdminOrder,
  updateAdminOrderStatus,
} from "../services/orders.service";

type Props = { orderId: string };

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export function AdminOrderDetail({ orderId }: Props) {
  const qc = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.order(orderId),
    queryFn: () => fetchAdminOrder(orderId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: (typeof STATUS_OPTIONS)[number]) =>
      updateAdminOrderStatus(
        orderId,
        status.toUpperCase() as
        | "PENDING"
        | "PAID"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED"
      ),
    onSuccess: (updatedOrder) => {
      toast.success("Order status updated");
      qc.setQueryData(queryKeys.admin.order(orderId), (current) =>
        current
          ? { ...current, order: updatedOrder }
          : { order: updatedOrder, customerUserId: updatedOrder.userId }
      );
      void qc.invalidateQueries({ queryKey: queryKeys.admin.orders() });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not update status"));
    },
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Order not found"
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

  const { order, customerUserId } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Order</p>
          <h2 className="font-heading text-2xl font-semibold tabular-nums">
            {order.orderNumber}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {format(new Date(order.createdAt), "yyyy-MM-dd")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Badge>{order.status}</Badge>
          <Select
            value={order.status}
            disabled={statusMutation.isPending}
            onValueChange={(value) =>
              statusMutation.mutate(value as (typeof STATUS_OPTIONS)[number])
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link
            href={ROUTES.user(customerUserId)}
            className="text-primary text-sm hover:underline"
          >
            View customer
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide uppercase">Items</h3>
        <ul className="divide-y rounded-xl border">
          {order.items.map((item) => (
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
              <span className="text-muted-foreground">Tax</span>
              <span className="tabular-nums">${order.tax.toFixed(2)}</span>
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
        href={ROUTES.orders}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        All orders
      </Link>
    </div>
  );
}
