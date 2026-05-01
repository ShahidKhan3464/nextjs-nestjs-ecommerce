"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

export function useAppSectionMeta(): { title: string; hint?: string } {
  const pathname = usePathname();

  return useMemo(() => {
    if (pathname === "/dashboard") {
      return { title: "Dashboard", hint: "Your overview" };
    }
    if (pathname === "/profile") {
      return { title: "Profile", hint: "Account settings" };
    }
    if (pathname.startsWith("/products/") && pathname !== "/products") {
      return { title: "Product", hint: "Details & variants" };
    }
    if (pathname === "/products") {
      return { title: "Products", hint: "Browse catalog" };
    }
    if (pathname.startsWith("/orders/") && pathname !== "/orders") {
      return { title: "Order", hint: "Receipt & status" };
    }
    if (pathname === "/orders") {
      return { title: "Orders", hint: "Your history" };
    }
    if (pathname === "/cart") return { title: "Cart" };
    if (pathname === "/checkout") return { title: "Checkout" };
    if (pathname === "/wishlist") return { title: "Wishlist" };

    if (pathname === "/admin") {
      return { title: "Admin overview", hint: "Analytics" };
    }
    if (pathname === "/admin/users") return { title: "Users", hint: "Accounts" };
    if (pathname.startsWith("/admin/users/")) {
      return { title: "User detail", hint: "Customer record" };
    }
    if (pathname === "/admin/products/new") {
      return { title: "New product", hint: "Create catalog item" };
    }
    if (pathname === "/admin/products") {
      return { title: "Products", hint: "Inventory" };
    }
    if (pathname === "/admin/orders") {
      return { title: "Orders", hint: "All storefront orders" };
    }
    if (pathname.startsWith("/admin/orders/")) {
      return { title: "Order detail", hint: "Fulfillment" };
    }

    return { title: "Store" };
  }, [pathname]);
}
