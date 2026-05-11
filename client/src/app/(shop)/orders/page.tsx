import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AdminOrdersList } from "@/modules/admin/orders";
import { getAccessTokenPayload } from "@/lib/session-cookie";
import { OrdersList } from "@/modules/orders/components/orders-list";

export const metadata: Metadata = {
  title: "Orders",
  description: `Order history — ${siteConfig.name}`,
};

export default async function OrdersPage() {
  const session = await getAccessTokenPayload();

  if (session?.role === "admin") {
    return (
      <div className="space-y-4">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Orders
            </h1>
            <p className="text-muted-foreground text-sm">
              Every order placed through checkout, newest first—open one for full
              line items and totals.
            </p>
          </div>
        </header>
        <AdminOrdersList />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="text-muted-foreground text-sm">
          View status, totals, and receipts for everything you have ordered.
        </p>
      </header>
      <OrdersList />
    </div>
  );
}
