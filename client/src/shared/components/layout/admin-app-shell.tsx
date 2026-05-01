"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { useAppSectionMeta } from "@/shared/hooks/use-app-section-meta";
import { AppChromeHeader } from "@/shared/components/layout/app-chrome-header";
import {
  Users,
  Package,
  PlusCircle,
  ShoppingCart,
  LayoutDashboard,
} from "lucide-react";

const nav = [
  { href: ROUTES.dashboard, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.users, label: "Users", icon: Users },
  { href: ROUTES.products, label: "Products", icon: Package },
  { href: ROUTES.productNew, label: "New product", icon: PlusCircle },
  { href: ROUTES.orders, label: "Orders", icon: ShoppingCart },
];

function adminNavActive(pathname: string, href: string): boolean {
  if (href === ROUTES.dashboard) {
    return pathname === ROUTES.dashboard || pathname === `${ROUTES.dashboard}/`;
  }
  if (href === ROUTES.products) {
    return pathname === ROUTES.products;
  }
  if (href === ROUTES.productNew) {
    return pathname === ROUTES.productNew;
  }
  if (href === ROUTES.users) {
    return pathname === ROUTES.users || pathname.startsWith(`${ROUTES.users}/`);
  }
  if (href === ROUTES.orders) {
    return (
      pathname === ROUTES.orders || pathname.startsWith(`${ROUTES.orders}/`)
    );
  }
  return false;
}

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = useAppSectionMeta();

  return (
    <div className="bg-background flex min-h-screen">
      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className="border-border bg-muted/30 hidden w-56 shrink-0 flex-col border-r lg:flex"
      >
        <div className="border-border flex h-14 items-center border-b px-4">
          <span className="font-heading text-sm font-semibold tracking-tight">
            Admin
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {nav.map((item) => {
            const active = adminNavActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppChromeHeader sectionTitle={meta.title} sectionHint={meta.hint} />
        <div id="main-content" className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
