"use client";

import Image from "next/image";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/constants/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteAdminProduct,
  fetchAdminProducts,
} from "@/modules/admin/services/admin.service";

export function AdminProductsTable() {
  const qc = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: queryKeys.admin.products,
    queryFn: fetchAdminProducts,
  });

  const remove = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: async () => {
      toast.success("Product removed");
      await qc.invalidateQueries({ queryKey: queryKeys.admin.products });
    },
    onError: () => toast.error("Could not delete"),
  });

  if (isPending || !data) {
    return <p className="text-muted-foreground text-sm">Loading inventory…</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16" />
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Variants</TableHead>
            <TableHead className="w-28 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p: Product) => (
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
              <TableCell className="text-right tabular-nums">
                {p.variants.length}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(p.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-muted-foreground border-t px-4 py-3 text-xs">
        Clear titles, accurate prices, and up-to-date stock help customers shop
        with confidence.
      </p>
    </div>
  );
}
