"use client";

import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/constants/query-keys";
import type { AdminCategoryOption } from "../types";
import { Pagination } from "@/components/ui/pagination";
import { AdminTableSkeleton } from "@/modules/admin/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminCategories,
  deleteAdminCategory,
} from "../services/categories.service";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

export function AdminCategoriesList() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 350);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategoryOption | null>(
    null
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isPending, isFetching, isPlaceholderData } = useQuery({
    queryKey: [
      ...queryKeys.admin.categories,
      { search: debouncedSearch, page, perPage },
    ] as const,
    queryFn: () =>
      fetchAdminCategories({
        limit: perPage,
        search: debouncedSearch || undefined,
        page,
      }),
    placeholderData: (prev) => prev,
  });

  const remove = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: async () => {
      toast.success("Category deleted");
      setDeleteTarget(null);
      await qc.invalidateQueries({ queryKey: queryKeys.admin.categories });
    },
    onError: (error: AxiosError) => toast.error((error.response?.data as { message?: string })?.message ?? "Could not delete category"),
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
              placeholder="Search categories"
              onChange={(e) => setSearchInput(e.target.value)}
              aria-busy={isFetching && !isPlaceholderData}
            />
          </div>
          <Button
            onClick={() =>
              qc.invalidateQueries({ queryKey: queryKeys.admin.categories })
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-28 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                data.categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-md truncate text-sm">
                      {c.description}
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-2">
                      <Link
                        aria-label={`Edit ${c.name}`}
                        href={ROUTES.category(String(c.id))}
                        className={cn(buttonVariants({ size: "icon", variant: "outline" }))}
                      >
                        <Pencil />
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        aria-label={`Delete ${c.name}`}
                        onClick={() => setDeleteTarget(c)}
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
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently remove "${deleteTarget.name}".`
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
