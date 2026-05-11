import type { User } from "@/types";
import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";
import { verifyToken } from "@/lib/server-auth";
import { AUTH_SESSION_COOKIE } from "@/lib/auth-cookies";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import { userFromSessionPayload } from "@/lib/require-auth";

export async function GET() {
  const jar = await cookies();
  const session = jar.get(AUTH_SESSION_COOKIE)?.value;
  if (!session) {
    return jsonMessage("Unauthorized", 401);
  }
  const payload = await verifyToken(session);
  if (!payload || payload.typ !== "access") {
    return jsonMessage("Unauthorized", 401);
  }
  const user: User = userFromSessionPayload(payload);
  const body: ApiResponse<{ user: User }> = { data: { user } };
  return jsonOk(body);
}
