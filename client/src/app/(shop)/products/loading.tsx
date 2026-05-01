import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="mb-10 h-10 w-48" />
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <Skeleton className="h-96 rounded-xl" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/5 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
