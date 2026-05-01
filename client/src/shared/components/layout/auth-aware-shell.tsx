"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { SiteShell } from "@/shared/components/layout/site-shell";
import { AdminAppShell } from "@/shared/components/layout/admin-app-shell";
import { CustomerAppShell } from "@/shared/components/layout/customer-app-shell";

export function AuthAwareShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-10">{children}</div>
      </div>
    );
  }

  if (!user) {
    return <SiteShell>{children}</SiteShell>;
  }

  if (user.role === "admin") {
    return <AdminAppShell>{children}</AdminAppShell>;
  }

  return <CustomerAppShell>{children}</CustomerAppShell>;
}
