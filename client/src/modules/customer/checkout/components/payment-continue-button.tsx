"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useElements } from "@stripe/react-stripe-js";

type Props = {
  onContinue: () => void;
};

export function PaymentContinueButton({ onContinue }: Props) {
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);

  async function handleContinue() {
    if (!elements) {
      toast.error("Payment form is not ready yet");
      return;
    }

    setLoading(true);
    try {
      const { error } = await elements.submit();
      if (error) {
        toast.error(error.message ?? "Please check your card details");
        return;
      }
      onContinue();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      disabled={loading}
      onClick={() => void handleContinue()}
    >
      {loading ? "Validating…" : "Continue to review"}
    </Button>
  );
}
