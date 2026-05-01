"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { fetchAdminUser } from "@/modules/admin/services/admin.service";

type Props = {
  userId: string;
};

export function AdminUserDetail({ userId }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.user(userId),
    queryFn: () => fetchAdminUser(userId),
  });

  if (isPending) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="User not found"
        description="This account may have been removed."
        action={
          <Link
            href={ROUTES.adminUsers}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to users
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">User</p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {data.name}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{data.email}</p>
        </div>
        <Badge>{data.role}</Badge>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="bg-muted/40 border-border rounded-lg border p-4">
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            User ID
          </dt>
          <dd className="mt-1 font-mono text-sm">{data.id}</dd>
        </div>
        <div className="bg-muted/40 border-border rounded-lg border p-4">
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Joined
          </dt>
          <dd className="mt-1 text-sm tabular-nums">
            {format(new Date(data.createdAt), "PPpp")}
          </dd>
        </div>
      </dl>

      <Link
        href={ROUTES.adminUsers}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        All users
      </Link>
    </div>
  );
}
