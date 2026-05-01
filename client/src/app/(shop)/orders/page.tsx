import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { OrdersList } from "@/modules/orders/components/orders-list";

export const metadata: Metadata = {
  title: "Orders",
  description: `Order history — ${siteConfig.name}`,
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="text-muted-foreground text-sm">
          Authenticated TanStack Query list with optimistic cache keys.
        </p>
      </header>
      <OrdersList />
    </div>
  );
}
