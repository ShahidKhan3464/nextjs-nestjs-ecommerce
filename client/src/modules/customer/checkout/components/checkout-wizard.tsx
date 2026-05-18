"use client";

import Link from "next/link";
import { toast } from "sonner";
import * as React from "react";
import { cn } from "@/lib/utils";
import type { Address } from "../types";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/constants/routes";
import { api } from "@/services/api/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { getApiErrorMessage } from "@/lib/api-error";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutStore } from "@/store/checkout-store";
import { placeOrder } from "../services/checkout.service";
import { Button, buttonVariants } from "@/components/ui/button";
import { shippingSchema, type ShippingValues } from "../schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export function CheckoutWizard() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const step = useCheckoutStore((s) => s.step);
  const clearCart = useCartStore((s) => s.clear);
  const setStep = useCheckoutStore((s) => s.setStep);
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const setCoupon = useCheckoutStore((s) => s.setCoupon);
  const couponCode = useCheckoutStore((s) => s.couponCode);
  const setShipping = useCheckoutStore((s) => s.setShipping);
  const paymentSummary = useCheckoutStore((s) => s.paymentSummary);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const setPaymentSummary = useCheckoutStore((s) => s.setPaymentSummary);

  const [couponInput, setCouponInput] = React.useState("");
  const [couponValid, setCouponValid] = React.useState<string | null>(null);

  const form = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: shippingAddress?.fullName ?? "",
      line1: shippingAddress?.line1 ?? "",
      line2: shippingAddress?.line2 ?? "",
      city: shippingAddress?.city ?? "",
      region: shippingAddress?.region ?? "",
      postalCode: shippingAddress?.postalCode ?? "",
      country: shippingAddress?.country ?? "US",
      phone: shippingAddress?.phone ?? "",
    },
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  async function validateCoupon() {
    const code = couponInput.trim();
    if (!code) {
      setCoupon(null);
      setCouponValid(null);
      return;
    }
    try {
      await api.get(`/api/v1/coupons/${encodeURIComponent(code)}`);
      setCoupon(code.toUpperCase());
      setCouponValid(code.toUpperCase());
      toast.success("Coupon applied");
    } catch {
      setCoupon(null);
      setCouponValid(null);
      toast.error("Invalid coupon");
    }
  }

  async function onShipping(values: ShippingValues) {
    setShipping(values as Address);
    setStep("payment");
  }

  function onPaymentMock(method: "card" | "paypal") {
    const summary = method === "card" ? "Visa •••• 4242" : "PayPal account";
    setPaymentSummary(summary);
    setStep("review");
  }

  async function submitOrder() {
    if (!shippingAddress?.fullName || !paymentSummary) {
      toast.error("Complete all steps first");
      return;
    }
    try {
      const order = await placeOrder({
        items: items.map((i) => ({
          productSlug: i.slug,
          quantity: i.quantity,
          variantId: i.variantId,
        })),
        couponCode: couponCode ?? undefined,
        shippingAddress: shippingAddress as Address,
        payment: { method: "card", summary: paymentSummary },
      });
      clearCart();
      resetCheckout();
      toast.success("Order placed");
      router.push(ROUTES.order(order.id));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Checkout failed"));
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="font-medium">Your cart is empty.</p>
        <Link
          href={ROUTES.products}
          className={cn(buttonVariants(), "mt-6 inline-flex justify-center")}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_340px] lg:px-6">
      <Tabs
        value={step}
        className="space-y-6"
        onValueChange={(v) => setStep(v as typeof step)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        <TabsContent value="shipping">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onShipping)}
            >
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="line1"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address line 1</FormLabel>
                    <FormControl>
                      <Input autoComplete="address-line1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="line2"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address line 2</FormLabel>
                    <FormControl>
                      <Input autoComplete="address-line2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input autoComplete="address-level2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="region"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Region</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="postalCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input autoComplete="postal-code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input autoComplete="country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Continue to payment</Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Choose how you would like to pay. You will confirm the total on the
            review step before placing your order.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => onPaymentMock("card")}>
              Pay with card
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onPaymentMock("paypal")}
            >
              Pay with PayPal
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <div className="space-y-2 text-sm">
            <p className="font-medium">Shipping</p>
            <p className="text-muted-foreground">
              {shippingAddress?.fullName}
              <br />
              {shippingAddress?.line1}
              {shippingAddress?.line2 && (
                <>
                  <br />
                  {shippingAddress.line2}
                </>
              )}
              <br />
              {shippingAddress?.city}, {shippingAddress?.region}{" "}
              {shippingAddress?.postalCode}
              <br />
              {shippingAddress?.country}
            </p>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <p className="font-medium">Payment</p>
            <p className="text-muted-foreground">{paymentSummary}</p>
          </div>
          <Separator />
          <Button type="button" onClick={() => void submitOrder()}>
            Place order
          </Button>
        </TabsContent>
      </Tabs>

      <aside className="bg-muted/40 border-border h-fit space-y-4 rounded-xl border p-6 lg:sticky lg:top-28">
        <p className="font-medium">Order summary</p>
        <ul className="space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.variantId} className="flex justify-between gap-4">
              <span className="min-w-0 truncate">
                {i.name} × {i.quantity}
              </span>
              <span className="tabular-nums">
                ${(i.price * i.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="coupon">
            Coupon
          </label>
          <div className="flex gap-2">
            <Input
              id="coupon"
              value={couponInput}
              placeholder="WELCOME10"
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => void validateCoupon()}
            >
              Apply
            </Button>
          </div>
          {couponValid && (
            <p className="text-muted-foreground text-xs">
              Applied {couponValid}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
