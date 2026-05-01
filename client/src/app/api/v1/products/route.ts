import type { Product } from "@/types";
import type { PaginatedResponse } from "@/types";
import { getProductCatalog } from "@/lib/product-store";

function parseNumber(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const category = (searchParams.get("category") ?? "").trim();
  const minPrice = parseNumber(searchParams.get("minPrice"), NaN);
  const maxPrice = parseNumber(searchParams.get("maxPrice"), NaN);
  const minRating = parseNumber(searchParams.get("minRating"), NaN);
  const sort = searchParams.get("sort") ?? "featured";
  const page = Math.max(1, parseNumber(searchParams.get("page"), 1));
  const limit = Math.min(48, Math.max(1, parseNumber(searchParams.get("limit"), 12)));

  let items = [...getProductCatalog()];

  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (category) {
    items = items.filter((p) => p.category === category);
  }
  if (!Number.isNaN(minRating)) {
    items = items.filter((p) => p.rating >= minRating);
  }
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    items = items.filter((p) => {
      const minVariantPrice = Math.min(...p.variants.map((v) => v.price));
      if (!Number.isNaN(minPrice) && minVariantPrice < minPrice) return false;
      if (!Number.isNaN(maxPrice) && minVariantPrice > maxPrice) return false;
      return true;
    });
  }

  switch (sort) {
    case "price-asc":
      items.sort(
        (a, b) =>
          Math.min(...a.variants.map((v) => v.price)) -
          Math.min(...b.variants.map((v) => v.price))
      );
      break;
    case "price-desc":
      items.sort(
        (a, b) =>
          Math.min(...b.variants.map((v) => v.price)) -
          Math.min(...a.variants.map((v) => v.price))
      );
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      items.reverse();
      break;
    case "featured":
    default:
      items.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);

  const body: PaginatedResponse<Product> = {
    data: pageItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };

  return Response.json(body, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
