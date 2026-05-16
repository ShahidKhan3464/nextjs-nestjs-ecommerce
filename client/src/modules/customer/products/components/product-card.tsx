"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../types";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";

type Props = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <motion.article
      layout
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-card border-border group relative flex flex-col overflow-hidden rounded-xl border",
        className
      )}
    >
      <Link
        href={ROUTES.product(product.slug)}
        className="relative aspect-4/5 overflow-hidden"
      >
        <Image
          fill
          alt=""
          sizes="(max-width:768px) 50vw, 25vw"
          src={product.images[0] ?? "/placeholder.svg"}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {product.featured && (
          <Badge className="absolute top-3 left-3 text-xs">Featured</Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={ROUTES.product(product.slug)}
              className="line-clamp-2 font-medium hover:underline"
            >
              {product.name}
            </Link>
            <p className="text-muted-foreground mt-1 text-xs">
              {product.category}
            </p>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="shrink-0"
            aria-pressed={wishlisted}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
          >
            <Heart
              className={cn(
                "size-4",
                wishlisted && "fill-primary text-primary"
              )}
            />
          </Button>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {product.rating.toFixed(1)} ★ ({product.reviewCount})
          </span>
          <span className="font-medium tabular-nums">
            From ${minPrice.toFixed(0)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
