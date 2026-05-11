"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/constants/query-keys";
import { Pagination } from "@/components/ui/pagination";
import { AdminTableSkeleton } from "@/modules/admin/shared";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminProduct,
  fetchAdminProducts,
} from "../services/products.service";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminProductsList() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 350);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isPending, isFetching, isPlaceholderData } = useQuery({
    queryKey: [
      ...queryKeys.admin.products,
      { search: debouncedSearch, page, perPage },
    ] as const,
    queryFn: () =>
      fetchAdminProducts({
        limit: perPage,
        page,
        search: debouncedSearch || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const remove = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: async () => {
      toast.success("Product removed");
      setDeleteTarget(null);
      await qc.invalidateQueries({ queryKey: queryKeys.admin.products });
    },
    onError: () => toast.error("Could not delete"),
  });

  const showInitialSkeleton = isPending && !data;

  if (showInitialSkeleton) {
    return <AdminTableSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          <div className="w-72">
            <Input
              value={searchInput}
              placeholder="Search products"
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button
            onClick={() =>
              qc.invalidateQueries({ queryKey: queryKeys.admin.products })
            }
          >
            Refresh
          </Button>
        </div>

        <div
          className={
            isFetching && !isPlaceholderData ? "opacity-60 transition-opacity" : ""
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16" />
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead className="w-28 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No products match your search.
                  </TableCell>
                </TableRow>
              ) : (
                data.products.map((p: Product) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                        <Image
                          fill
                          alt=""
                          sizes="40px"
                          src={p.images[0]}
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {p.category}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {p.variants.length}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="destructive"
                        aria-label={`Delete ${p.name}`}
                        onClick={() => setDeleteTarget(p)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            page={page}
            perPage={perPage}
            onPageChange={(p) => setPage(p)}
            totalPages={data.pagination?.totalPages ?? 1}
            onPerPageChange={(n) => {
              setPerPage(n);
              setPage(1);
            }}
          />
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently remove "${deleteTarget.name}" and its variants from the catalog.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={remove.isPending}
              onClick={() => {
                if (deleteTarget) remove.mutate(deleteTarget.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
