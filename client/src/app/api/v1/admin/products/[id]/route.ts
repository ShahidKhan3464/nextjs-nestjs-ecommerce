import { z } from "zod";
import type { Product } from "@/types";
import type { ApiResponse } from "@/types";
import { requireAdmin } from "@/lib/require-auth";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import {
  upsertProduct,
  deleteProductById,
  getProductCatalog,
} from "@/lib/product-store";

const variantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  sku: z.string(),
  name: z.string(),
  options: z.record(z.string(), z.string()),
  price: z.number().positive(),
  compareAtPrice: z.number().optional(),
  stock: z.number().int().min(0),
  image: z.string().optional(),
});

const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  rating: z.number(),
  reviewCount: z.number().int().min(0),
  images: z.array(z.string()),
  variants: z.array(variantSchema).min(1),
  featured: z.boolean().optional(),
});

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }
  const parsed = productSchema.safeParse(json);
  if (!parsed.success || parsed.data.id !== id) {
    return jsonMessage("Invalid product payload", 422);
  }
  const product = parsed.data as Product;
  upsertProduct(product);
  const body: ApiResponse<{ product: Product }> = { data: { product } };
  return jsonOk(body);
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  const exists = getProductCatalog().some((p) => p.id === id);
  if (!exists) {
    return jsonMessage("Product not found", 404);
  }
  deleteProductById(id);
  const body: ApiResponse<{ ok: true }> = { data: { ok: true } };
  return jsonOk(body);
}
