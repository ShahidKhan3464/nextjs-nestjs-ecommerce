"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/constants/query-keys";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { fetchOrders } from "../services/orders.service";
import { AdminTableSkeleton } from "@/modules/admin/shared";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button, buttonVariants } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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

export function OrdersList() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isPending } = useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: fetchOrders,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((o) => {
      const idMatch = o.id.toLowerCase().includes(q);
      const statusMatch = o.status.toLowerCase().includes(q);
      const itemMatch = o.items.some(
        (i) =>
          i.productName.toLowerCase().includes(q) ||
          i.variantLabel.toLowerCase().includes(q)
      );
      return idMatch || statusMatch || itemMatch;
    });
  }, [data, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageClamped = Math.min(page, totalPages);
  const sliceStart = (pageClamped - 1) * perPage;
  const pageRows = filtered.slice(sliceStart, sliceStart + perPage);

  useEffect(() => {
    if (page !== pageClamped) setPage(pageClamped);
  }, [page, pageClamped]);

  if (isPending) {
    return (
      <AdminTableSkeleton
        filterWidths={["w-72", "w-24"]}
        columns={[
          { className: "flex-1" },
          { className: "w-24" },
          { className: "flex-1" },
          { className: "min-w-32 flex-1" },
          { className: "w-24 shrink-0" },
          { className: "w-36 shrink-0", isAction: true },
        ]}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place an order, it will appear here."
        action={
          <Link href={ROUTES.products} className={cn(buttonVariants())}>
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <div className="w-72">
          <Input
            value={searchInput}
            placeholder="Search orders"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button
          onClick={() =>
            qc.invalidateQueries({ queryKey: queryKeys.orders.list() })
          }
        >
          Refresh
        </Button>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead className="min-w-32 whitespace-normal">
                Items
              </TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-10 text-center text-sm"
                >
                  No orders match your search.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status] ?? "outline"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm tabular-nums">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-56 text-sm whitespace-normal">
                    {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                    {order.items[0] ? ` · ${order.items[0].productName}` : ""}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={ROUTES.order(order.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          perPage={perPage}
          page={pageClamped}
          onPageChange={setPage}
          totalPages={totalPages}
          onPerPageChange={(n) => {
            setPerPage(n);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
