import type { Product } from "@/types";
import type { ApiResponse } from "@/types";
import { findProductBySlug } from "@/lib/product-store";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const product = findProductBySlug(slug);
  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }
  const body: ApiResponse<Product> = { data: product };
  return Response.json(body, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    },
  });
}
