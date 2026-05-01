import type { Metadata } from "next";
import { AdminUsersList } from "@/modules/admin/components/admin-users-list";

export const metadata: Metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground max-w-2xl text-sm">
        Everyone who has created an account—review roles and contact details in
        one place.
      </p>
      <AdminUsersList />
    </div>
  );
}
