import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";
import { jsonOk } from "@/lib/api-response";
import {
  AUTH_BACKEND_ACCESS_COOKIE,
  AUTH_SESSION_COOKIE,
} from "@/lib/auth-cookies";

export async function POST() {
  const jar = await cookies();
  jar.delete(AUTH_SESSION_COOKIE);
  jar.delete(AUTH_BACKEND_ACCESS_COOKIE);
  jar.delete("refresh_token");
  jar.delete("shop_return_path");
  const payload: ApiResponse<{ ok: true }> = { data: { ok: true } };
  return jsonOk(payload);
}
