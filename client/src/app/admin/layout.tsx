import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AdminAppShell } from "@/shared/components/layout/admin-app-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: `Operations — ${siteConfig.name}`,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAppShell>{children}</AdminAppShell>;
}
