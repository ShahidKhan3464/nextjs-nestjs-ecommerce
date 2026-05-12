"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { useProductSearchParams } from "../hooks/use-product-search-params";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

const categories = ["Apparel", "Home", "Accessories", "Footwear"];

export function ProductFilters() {
  const { values, setParams } = useProductSearchParams();
  const [qLocal, setQLocal] = React.useState(values.q);

  React.useEffect(() => {
    setQLocal(values.q);
  }, [values.q]);

  const debouncedQ = useDebouncedCallback((value: string) => {
    setParams({ q: value, page: 1 });
  }, 350);

  return (
    <div className="bg-muted/40 border-border rounded-xl border p-4">
      <div className="flex flex-row flex-wrap justify-end items-end gap-4">
        <div className="min-w-[min(100%,200px)] space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={qLocal}
            placeholder="Search products…"
            aria-describedby="search-hint"
            onChange={(e) => {
              const v = e.target.value;
              setQLocal(v);
              debouncedQ(v);
            }}
          />
        </div>

        <div className="w-full min-w-[140px] space-y-2 sm:w-auto">
          <Label>Category</Label>
          <Select
            value={values.category || "all"}
            onValueChange={(v) => {
              if (v == null) return;
              setParams({ category: v === "all" ? "" : v, page: 1 });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.filter(Boolean).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full min-w-[140px] space-y-2 sm:w-auto">
          <Label>Max price</Label>
          <Select
            value={values.maxPrice || "400"}
            onValueChange={(v) => {
              if (v == null) return;
              setParams({ maxPrice: v, page: 1 });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">$50 or less</SelectItem>
              <SelectItem value="100">$100 or less</SelectItem>
              <SelectItem value="200">$200 or less</SelectItem>
              <SelectItem value="300">$300 or less</SelectItem>
              <SelectItem value="400">$400 or less</SelectItem>
              <SelectItem value="1000">$1000 or less</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full min-w-[140px] space-y-2 sm:w-auto">
          <Label>Minimum rating</Label>
          <Select
            value={values.minRating || "any"}
            onValueChange={(v) => {
              if (v == null) return;
              setParams({ minRating: v === "any" ? "" : v, page: 1 });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full min-w-[140px] space-y-2 sm:w-auto sm:min-w-[160px]">
          <Label>Sort</Label>
          <Select
            value={values.sort}
            onValueChange={(v) => {
              if (v == null) return;
              setParams({ sort: v, page: 1 });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() =>
              setParams({
                q: "",
                category: "",
                minPrice: "",
                maxPrice: "",
                minRating: "",
                sort: "featured",
                page: 1,
              })
            }
          >
            Reset filters
          </Button>
        </div>
      </div>
    </div>
  );
}
