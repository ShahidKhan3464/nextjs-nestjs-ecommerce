import type { Coupon } from "@/types";
import type { ApiResponse } from "@/types";
import { MOCK_COUPONS } from "@/lib/mock-data";
import { jsonMessage, jsonOk } from "@/lib/api-response";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;
  const upper = decodeURIComponent(code).toUpperCase();
  const coupon = MOCK_COUPONS.find((c) => c.code === upper);
  if (!coupon) {
    return jsonMessage("Coupon not found", 404);
  }
  const body: ApiResponse<{ coupon: Coupon }> = {
    data: {
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minSubtotal: coupon.minSubtotal,
      },
    },
  };
  return jsonOk(body);
}
