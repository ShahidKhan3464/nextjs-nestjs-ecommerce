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
import { fetchAdminUser } from "../services/users.service";
import { EmptyState } from "@/shared/components/feedback/empty-state";

type Props = {
  userId: string;
};

export function AdminUserDetail({ userId }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.user(userId),
    queryFn: () => fetchAdminUser(userId),
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="User not found"
        description="This account may have been removed."
        action={
          <Link
            href={ROUTES.users}
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
            {data.fullName}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{data.email}</p>
          {data.phoneNumber && (
            <p className="text-muted-foreground mt-1 text-sm">
              {data.phoneNumber}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {data.isBlocked ? (
            <Badge variant="destructive">Blocked</Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
            >
              Active
            </Badge>
          )}
          <Badge>{data.role}</Badge>
        </div>
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
        href={ROUTES.users}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        All users
      </Link>
    </div>
  );
}
