import type { Metadata } from "next";
import { AdminOrdersList } from "@/modules/admin/components/admin-orders-list";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground max-w-2xl text-sm">
        Every order placed through checkout, newest first—open one for full line
        items and totals.
      </p>
      <AdminOrdersList />
    </div>
  );
}
