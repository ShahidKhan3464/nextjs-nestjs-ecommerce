import type { Metadata } from "next";
import { AdminOrdersList } from "@/modules/admin/components/admin-orders-list";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground max-w-2xl text-sm">
        Every order placed through checkout (in-memory for this demo).
      </p>
      <AdminOrdersList />
    </div>
  );
}
