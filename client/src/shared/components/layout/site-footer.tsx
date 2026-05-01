import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export function SiteFooter() {
  return (
    <footer className="border-border bg-muted/30 mt-auto border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-sm space-y-3">
          <p className="font-heading text-lg font-semibold">{siteConfig.name}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {siteConfig.description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div className="space-y-3">
            <p className="font-medium">Shop</p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <Link className="hover:text-foreground" href={ROUTES.products}>
                  All products
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href={ROUTES.cart}>
                  Cart
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href={ROUTES.checkout}>
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-medium">Account</p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <Link className="hover:text-foreground" href={ROUTES.login}>
                  Sign in
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href={ROUTES.register}>
                  Register
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href={ROUTES.orders}>
                  Orders
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-medium">Legal</p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <span className="cursor-not-allowed opacity-70">
                  Privacy (demo)
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-70">
                  Terms (demo)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-border border-t py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {siteConfig.name}. Demo storefront.
      </div>
    </footer>
  );
}
