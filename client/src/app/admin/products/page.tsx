import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { AdminProductsTable } from "@/modules/admin/components/admin-products-table";

export const metadata: Metadata = {
  title: "Admin products",
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Inventory
          </h1>
          <p className="text-muted-foreground text-sm">
            Maintain your catalog here—edit listings, adjust pricing, and remove
            items that are no longer offered.
          </p>
        </div>
        <Link
          href={ROUTES.adminProductNew}
          className={cn(buttonVariants({ size: "default" }))}
        >
          Add product
        </Link>
      </header>
      <AdminProductsTable />
    </div>
  );
}
