import { Skeleton } from "@/components/ui/skeleton";
import type { AdminTableSkeletonProps } from "../types";

export function AdminTableSkeleton({
  rows = 8,
  withToolbar = true,
}: AdminTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {withToolbar ? (
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-10 w-40 rounded-md" />
          <Skeleton className="h-10 w-72 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      ) : null}
      <div className="overflow-hidden rounded-md border bg-card">
        <div className="border-b px-2 py-3">
          <div className="flex gap-2">
            <Skeleton className="h-4 flex-1 max-w-[28%]" />
            <Skeleton className="h-4 flex-1 max-w-[28%]" />
            <Skeleton className="h-4 w-20 shrink-0" />
          </div>
        </div>
        <div className="space-y-0 divide-y p-0">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-2.5">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-8 w-20 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
