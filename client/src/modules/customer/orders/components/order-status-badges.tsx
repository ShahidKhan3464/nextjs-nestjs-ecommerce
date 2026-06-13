import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus } from "../types";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export const orderStatusVariant: Record<OrderStatus, BadgeVariant> = {
  pending: "outline",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export const paymentStatusVariant: Record<PaymentStatus, BadgeVariant> = {
  paid: "default",
  failed: "destructive",
  refunded: "secondary",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={orderStatusVariant[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return <Badge variant={paymentStatusVariant[status]}>{status}</Badge>;
}
