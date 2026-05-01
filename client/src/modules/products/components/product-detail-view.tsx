"use client";

import Image from "next/image";
import { toast } from "sonner";
import * as React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { Separator } from "@/components/ui/separator";
import type { Product, ProductVariant } from "@/types";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

type Props = {
  product: Product;
};

export function ProductDetailView({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const recordView = useRecentlyViewedStore((s) => s.recordView);
  const [variantId, setVariantId] = React.useState(product.variants[0]?.id ?? "");

  React.useEffect(() => {
    recordView(product.slug);
  }, [product.slug, recordView]);

  const variant: ProductVariant | undefined = product.variants.find(
    (v) => v.id === variantId
  );

  const images = React.useMemo(() => {
    const primary = variant?.image ?? product.images[0];
    const rest = product.images.filter((i) => i !== primary);
    return primary ? [primary, ...rest] : product.images;
  }, [product.images, variant?.image]);

  const [activeImage, setActiveImage] = React.useState(images[0]);

  React.useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  function handleAddToCart() {
    if (!variant) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantLabel: variant.name,
      price: variant.price,
      quantity: 1,
      image: variant.image ?? product.images[0],
      maxQty: variant.stock,
    });
    toast.success("Added to bag");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
      <div className="space-y-4">
        <motion.div
          layout
          className="bg-muted relative aspect-4/5 overflow-hidden rounded-2xl"
        >
          <Image
            fill
            alt=""
            priority
            src={activeImage}
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 55vw"
          />
        </motion.div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src) => (
            <button
              key={src}
              type="button"
              aria-label="Product thumbnail"
              data-active={src === activeImage}
              onClick={() => setActiveImage(src)}
              className="border-border relative size-16 shrink-0 overflow-hidden rounded-md border data-[active=true]:ring-2 data-[active=true]:ring-ring"
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.featured && <Badge>Featured</Badge>}
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {product.rating.toFixed(1)} ★ · {product.reviewCount} reviews
          </p>
        </div>

        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold tabular-nums">
              ${variant?.price.toFixed(2) ?? "—"}
            </span>
            {variant?.compareAtPrice && (
              <span className="text-muted-foreground text-sm line-through tabular-nums">
                ${variant.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="variant">Variant</Label>
              <Select
                value={variantId}
                onValueChange={(v) => {
                  if (v) setVariantId(v);
                }}
              >
                <SelectTrigger id="variant">
                  <SelectValue placeholder="Choose variant" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((v) => (
                    <SelectItem key={v.id} value={v.id} disabled={v.stock <= 0}>
                      {v.name}
                      {v.stock <= 0 ? " — Out of stock" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-muted-foreground text-sm">
                Stock:{" "}
                <span className="text-foreground font-medium tabular-nums">
                  {variant?.stock ?? 0}
                </span>
              </p>
            </div>
          </div>

          <Button
            size="lg"
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto"
            disabled={!variant || variant.stock <= 0}
          >
            Add to bag
          </Button>
        </div>
      </div>
    </div>
  );
}
