import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";
import { jsonOk } from "@/lib/api-response";

export async function POST() {
  const jar = await cookies();
  jar.delete("access_token");
  jar.delete("refresh_token");
  const payload: ApiResponse<{ ok: true }> = { data: { ok: true } };
  return jsonOk(payload);
}
