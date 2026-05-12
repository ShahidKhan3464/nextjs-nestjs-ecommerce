import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { WishlistGrid } from "@/modules/customer/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  description: `Saved products — ${siteConfig.name}`,
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Wishlist
        </h1>
        <p className="text-muted-foreground text-sm">
          Save pieces you love and come back when you are ready to decide.
        </p>
      </header>
      <WishlistGrid />
    </div>
  );
}
