"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

export function RecentlyViewedStrip() {
  const slugs = useRecentlyViewedStore((s) => s.slugs);

  if (slugs.length === 0) return null;

  return (
    <section
      aria-label="Recently viewed products"
      className="border-border bg-muted/20 mb-12 rounded-xl border px-4 py-5 sm:px-6"
    >
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
        Recently viewed
      </p>
      <ul className="flex flex-wrap gap-3">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={ROUTES.product(slug)}
              className="bg-background hover:bg-muted inline-flex rounded-full border px-3 py-1 text-sm transition-colors"
            >
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
