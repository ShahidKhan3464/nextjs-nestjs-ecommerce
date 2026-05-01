"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-medium">Could not load product</p>
      <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
      <Button type="button" className="mt-6" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
