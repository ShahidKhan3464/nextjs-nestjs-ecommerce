import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CheckoutWizard } from "@/modules/checkout/components/checkout-wizard";

export const metadata: Metadata = {
  title: "Checkout",
  description: `Checkout — ${siteConfig.name}`,
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Checkout
        </h1>
        <p className="text-muted-foreground text-sm">
          Multi-step flow with shipping, mock payment, coupon validation, and
          order snapshot on the server.
        </p>
      </header>
      <CheckoutWizard />
    </div>
  );
}
