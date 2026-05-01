import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-lg font-medium">Collection not found</p>
      <p className="text-muted-foreground mt-2 text-sm">
        This segment does not exist.
      </p>
      <Link
        href={ROUTES.products}
        className={cn(buttonVariants(), "mt-8 inline-flex justify-center")}
      >
        Back to shop
      </Link>
    </div>
  );
}
