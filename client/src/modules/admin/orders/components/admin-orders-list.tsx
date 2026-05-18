"use client";

import { format } from "date-fns";
import { EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/constants/query-keys";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { AdminTableSkeleton } from "@/modules/admin/shared";
import { fetchAdminOrders } from "../services/orders.service";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

export function AdminOrdersList() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isPending } = useQuery({
    queryKey: queryKeys.admin.orders,
    queryFn: fetchAdminOrders,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((o) => {
      const idMatch = o.id.toLowerCase().includes(q);
      const statusMatch = o.status.toLowerCase().includes(q);
      return idMatch || statusMatch;
    });
  }, [data, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageClamped = Math.min(page, totalPages);
  const sliceStart = (pageClamped - 1) * perPage;
  const pageRows = filtered.slice(sliceStart, sliceStart + perPage);

  useEffect(() => {
    if (page !== pageClamped) setPage(pageClamped);
  }, [page, pageClamped]);

  if (isPending || !data) {
    return (
      <AdminTableSkeleton
        filterWidths={["w-72", "w-24"]}
        columns={[
          { className: "flex-1" },
          { className: "w-24" },
          { className: "flex-1" },
          { className: "w-24" },
          { className: "w-36 shrink-0", isAction: true },
        ]}
      />
    );
  }

  if (!data) {
    return null;
  }

  const total = data.length;
  const hasSearch = debouncedSearch.trim().length > 0;
  const isEmptyCatalog = total === 0 && !hasSearch;
  const showPagination = filtered.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <div className="w-72">
          <Input
            value={searchInput}
            disabled={isEmptyCatalog}
            placeholder="Search by order id or status"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button
          onClick={() =>
            qc.invalidateQueries({ queryKey: queryKeys.admin.orders })
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
              <TableHead>Total</TableHead>
              <TableHead className="w-36 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-10 text-center text-sm"
                >
                  No orders match your search.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((o) => (
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
                  <TableCell className="font-medium tabular-nums">
                    ${o.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        // console.log(o.id);
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {showPagination ? (
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
        ) : null}
      </div>
    </div>
  );
}
