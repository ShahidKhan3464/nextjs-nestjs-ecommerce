"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { ShopRoleShell } from "@/shared/components/layout/shop-role-shell";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-background min-h-screen">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:p-6">
          {children}
        </div>
      </div>
    );
  }

  const role = user?.role === "admin" ? "admin" : "customer";
  return <ShopRoleShell role={role}>{children}</ShopRoleShell>;
}
