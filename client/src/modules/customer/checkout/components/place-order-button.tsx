"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { completeCheckout } from "../services/checkout.service";
import { useStripe, useElements } from "@stripe/react-stripe-js";

type Props = {
  onSuccess: () => void;
};

export function PlaceOrderButton({ onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);

  async function handlePlaceOrder() {
    if (!stripe || !elements) {
      toast.error("Payment form is not ready yet");
      return;
    }

    setLoading(true);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message ?? "Please check your card details");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Payment failed");
        return;
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        toast.error("Payment was not completed");
        return;
      }

      await completeCheckout({
        paymentIntentId: paymentIntent.id,
      });
      onSuccess();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Checkout failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" disabled={loading} onClick={() => void handlePlaceOrder()}>
      {loading ? "Processing…" : "Place order"}
    </Button>
  );
}
