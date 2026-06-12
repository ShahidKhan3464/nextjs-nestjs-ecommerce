"use client";

import { PaymentElement } from "@stripe/react-stripe-js";

export function StripePaymentForm() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Pay securely with your credit or debit card.
      </p>
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card"],
          wallets: {
            applePay: "never",
            googlePay: "never",
          },
        }}
      />
    </div>
  );
}
