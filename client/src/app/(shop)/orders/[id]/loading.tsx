import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Skeleton className="h-12 w-48" />
      <Skeleton className="mt-8 h-64 w-full rounded-xl" />
    </div>
  );
}
