import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CartPageView } from "@/modules/cart/components/cart-page-view";

export const metadata: Metadata = {
  title: "Cart",
  description: `Shopping cart — ${siteConfig.name}`,
};

export default function CartPage() {
  return <CartPageView />;
}
