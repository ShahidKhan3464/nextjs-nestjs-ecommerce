import { create } from "zustand";
import type { Address } from "@/modules/customer/orders/types";

type CheckoutStep = "shipping" | "payment" | "review";

interface CheckoutState {
  step: CheckoutStep;
  couponCode: string | null;
  paymentSummary: string | null;
  setStep: (step: CheckoutStep) => void;
  setShipping: (address: Address) => void;
  shippingAddress: Partial<Address> | null;
  setCoupon: (code: string | null) => void;
  setPaymentSummary: (summary: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: "shipping",
  couponCode: null,
  paymentSummary: null,
  shippingAddress: null,
  setStep: (step) => set({ step }),
  setCoupon: (couponCode) => set({ couponCode }),
  setShipping: (shippingAddress) => set({ shippingAddress, step: "payment" }),
  setPaymentSummary: (paymentSummary) =>
    set({ paymentSummary, step: "review" }),
  reset: () =>
    set({
      step: "shipping",
      couponCode: null,
      paymentSummary: null,
      shippingAddress: null,
    }),
}));
