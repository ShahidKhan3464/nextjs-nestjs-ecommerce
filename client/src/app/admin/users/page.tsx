import type { Metadata } from "next";
import { AdminUsersList } from "@/modules/admin/components/admin-users-list";

export const metadata: Metadata = {
  title: "Users",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground max-w-2xl text-sm">
        All registered accounts (demo data includes seeded users and self-registered
        customers).
      </p>
      <AdminUsersList />
    </div>
  );
}
