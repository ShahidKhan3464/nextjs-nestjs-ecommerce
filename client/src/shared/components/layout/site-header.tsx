"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { logoutRequest } from "@/modules/auth/services/auth.service";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sun,
  User,
  Menu,
  Moon,
  LogOut,
  Package,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";

type Props = {
  onOpenCart: () => void;
};

export function SiteHeader({ onOpenCart }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );
  const [mobileOpen, setMobileOpen] = React.useState(false);

  async function logout() {
    try {
      await logoutRequest();
    } catch {
      /* cookies cleared client-side anyway */
    }
    clearSession();
    router.refresh();
    router.push(ROUTES.home);
  }

  const nav = [
    { href: ROUTES.products, label: "Shop" },
    { href: ROUTES.wishlist, label: "Wishlist" },
    ...(user
      ? [
          { href: ROUTES.orders, label: "Orders" },
          { href: ROUTES.dashboard, label: "Dashboard" },
        ]
      : []),
  ];

  return (
    <motion.header
      layout
      className="border-border/80 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="font-heading text-base font-semibold tracking-tight"
        >
          {siteConfig.name}
        </Link>

        <nav className="text-muted-foreground hidden items-center gap-1 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-foreground rounded-md px-3 py-2 transition-colors",
                pathname === item.href && "bg-muted text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu className="size-4" />
          </Button>

          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={
              theme === "dark" ? "Activate light mode" : "Activate dark mode"
            }
          >
            <Sun className="dark:hidden size-4" />
            <Moon className="hidden size-4 dark:inline" />
          </Button>

          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="relative"
            onClick={onOpenCart}
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 && (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden gap-2 sm:inline-flex"
                )}
              >
                <User className="size-4" />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push(ROUTES.orders);
                  }}
                >
                  <Package className="mr-2 size-4" /> Orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push(ROUTES.dashboard);
                  }}
                >
                  <LayoutDashboard className="mr-2 size-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void logout()}>
                  <LogOut className="mr-2 size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={ROUTES.login}
              className={cn(
                buttonVariants({ size: "sm", variant: "default" }),
                "hidden sm:inline-flex"
              )}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-border bg-background md:hidden border-t px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="hover:bg-muted rounded-md px-3 py-2 text-sm"
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <Link
                href={ROUTES.login}
                onClick={() => setMobileOpen(false)}
                className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}
