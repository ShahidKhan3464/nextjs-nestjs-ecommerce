"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/store/cart-store";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetTitle,
  SheetFooter,
  SheetHeader,
  SheetContent,
} from "@/components/ui/sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartSheet({ open, onOpenChange }: Props) {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-full flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle className="font-heading text-lg">Your bag</SheetTitle>
          <p className="text-muted-foreground text-sm">
            {items.length === 0
              ? "Nothing here yet."
              : `${items.length} item${items.length === 1 ? "" : "s"}`}
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                layout
                key={item.variantId}
                className="flex gap-4 py-4"
                exit={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.18 }}
              >
                <div className="bg-muted relative size-20 shrink-0 overflow-hidden rounded-md">
                  <Image
                    fill
                    alt=""
                    sizes="80px"
                    src={item.image}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <Link
                      href={ROUTES.product(item.slug)}
                      onClick={() => onOpenChange(false)}
                      className="line-clamp-2 font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {item.variantLabel}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-md border">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="rounded-none"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQty(item.variantId, item.quantity - 1)
                        }
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="tabular-nums px-2 text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="rounded-none"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQty(item.variantId, item.quantity + 1)
                        }
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.variantId)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <span className="ml-auto text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length > 0 && <Separator className="my-2" />}
        </ScrollArea>

        <SheetFooter className="border-t bg-background/95 p-6 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className={cn("font-medium tabular-nums")}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {items.length === 0 ? (
              <Button className="w-full" type="button" disabled>
                Checkout
              </Button>
            ) : (
              <Link
                href={ROUTES.checkout}
                onClick={() => onOpenChange(false)}
                className={cn(
                  buttonVariants(),
                  "inline-flex w-full justify-center"
                )}
              >
                Checkout
              </Link>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Continue shopping
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
