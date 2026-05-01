import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Skeleton className="mb-8 h-10 w-48" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
