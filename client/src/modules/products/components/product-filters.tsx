"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useDebouncedCallback } from "use-debounce";
import { useProductSearchParams } from "@/modules/products/hooks/use-product-search-params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    <div className="bg-muted/40 border-border space-y-6 rounded-xl border p-4">
      <div className="space-y-2">
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
        <p id="search-hint" className="text-muted-foreground text-xs">
          Results update as you type (debounced).
        </p>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={values.category || "all"}
          onValueChange={(v) => {
            if (v == null) return;
            setParams({ category: v === "all" ? "" : v, page: 1 });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories
              .filter(Boolean)
              .map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <Label>Max price</Label>
          <span className="text-muted-foreground tabular-nums">
            ${values.maxPrice || "400"}
          </span>
        </div>
        <Slider
          min={20}
          step={5}
          max={400}
          value={[Number(values.maxPrice) || 400]}
          onValueCommitted={(v) => {
            const arr = Array.isArray(v) ? v : [v];
            const max = arr[0] ?? 400;
            setParams({ maxPrice: max, page: 1 });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum rating</Label>
        <Select
          value={values.minRating || "any"}
          onValueChange={(v) => {
            if (v == null) return;
            setParams({ minRating: v === "any" ? "" : v, page: 1 });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="4.5">4.5+ stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sort</Label>
        <Select
          value={values.sort}
          onValueChange={(v) => {
            if (v == null) return;
            setParams({ sort: v, page: 1 });
          }}
        >
          <SelectTrigger>
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

      <Button
        type="button"
        variant="outline"
        className="w-full"
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
  );
}
