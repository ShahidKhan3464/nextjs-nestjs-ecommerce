import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { AdminProductCreateForm } from "@/modules/admin/components/admin-product-create-form";

export const metadata: Metadata = {
  title: "New product",
};

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href={ROUTES.products}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
      >
        ← Back to products
      </Link>
      <p className="text-muted-foreground text-sm">
        Add a new product with images, description, price, and stock so it appears
        on the storefront right away.
      </p>
      <AdminProductCreateForm />
    </div>
  );
}
