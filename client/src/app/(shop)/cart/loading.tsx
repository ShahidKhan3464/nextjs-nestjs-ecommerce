import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Skeleton className="mb-8 h-10 w-32" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
