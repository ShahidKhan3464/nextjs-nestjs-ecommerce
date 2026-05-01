"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="font-medium">Orders failed to load</p>
      <Button type="button" onClick={() => reset()}>
        Retry
      </Button>
    </div>
  );
}
