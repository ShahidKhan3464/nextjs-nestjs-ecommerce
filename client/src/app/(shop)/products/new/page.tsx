import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { AdminProductCreateForm } from "@/modules/admin/products";

export const metadata: Metadata = {
  title: "New product",
};

export default function NewProductPage() {
  return (
    <div className="w-full max-w-full space-y-6">
      <Link
        href={ROUTES.products}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
      >
        ← Back to products
      </Link>
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          New product
        </h2>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Add images, pick a category, and set variant details (SKU, price, stock).
          The form aligns with the admin header above—full width of the main
          column.
        </p>
      </div>
      <AdminProductCreateForm />
    </div>
  );
}
