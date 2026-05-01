"use client";

import * as React from "react";
import { CartSheet } from "@/modules/cart/components/cart-sheet";
import { SiteFooter } from "@/shared/components/layout/site-footer";
import { SiteHeader } from "@/shared/components/layout/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onOpenCart={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
