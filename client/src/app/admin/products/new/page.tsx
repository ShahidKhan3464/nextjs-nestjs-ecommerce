import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { AdminProductCreateForm } from "@/modules/admin/components/admin-product-create-form";

export const metadata: Metadata = {
  title: "New product",
};

export default function AdminNewProductPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href={ROUTES.adminProducts}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
      >
        ← Back to products
      </Link>
      <p className="text-muted-foreground text-sm">
        Creates a catalog entry with one default variant — extend with multi-variant
        editors when your API supports it.
      </p>
      <AdminProductCreateForm />
    </div>
  );
}
