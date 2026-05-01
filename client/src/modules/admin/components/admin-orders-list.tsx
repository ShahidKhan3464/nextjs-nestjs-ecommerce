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
import { fetchAdminOrders } from "@/modules/admin/services/admin.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  paid: "default",
  pending: "outline",
  shipped: "secondary",
  delivered: "secondary",
  cancelled: "destructive",
};

export function AdminOrdersList() {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.admin.orders,
    queryFn: fetchAdminOrders,
  });

  if (isPending || !data) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-28 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-mono text-sm">#{o.id}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[o.status] ?? "outline"}>
                  {o.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(o.createdAt), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                ${o.total.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={ROUTES.adminOrder(o.id)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
