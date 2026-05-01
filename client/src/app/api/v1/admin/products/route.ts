import { z } from "zod";
import type { Product } from "@/types";
import type { ApiResponse } from "@/types";
import { requireAdmin } from "@/lib/require-auth";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import { getProductCatalog, upsertProduct } from "@/lib/product-store";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const list = getProductCatalog();
  const body: ApiResponse<{ products: Product[] }> = { data: { products: list } };
  return jsonOk(body);
}

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

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }
  const parsed = productSchema.safeParse(json);
  if (!parsed.success) {
    return jsonMessage("Invalid product payload", 422);
  }
  const product = parsed.data as Product;
  upsertProduct(product);
  const body: ApiResponse<{ product: Product }> = { data: { product } };
  return jsonOk(body, { status: 201 });
}
