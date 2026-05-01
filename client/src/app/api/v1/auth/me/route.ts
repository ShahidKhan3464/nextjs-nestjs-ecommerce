import type { User } from "@/types";
import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { verifyToken } from "@/lib/server-auth";
import { jsonMessage, jsonOk } from "@/lib/api-response";

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7);
}

export async function GET(req: Request) {
  const headerToken = bearer(req);
  const jar = await cookies();
  const cookieToken = jar.get("access_token")?.value;
  const raw = headerToken ?? cookieToken;
  if (!raw) {
    return jsonMessage("Unauthorized", 401);
  }
  const payload = await verifyToken(raw);
  if (!payload || payload.typ !== "access") {
    return jsonMessage("Unauthorized", 401);
  }
  const userRecord = MOCK_USERS.find((u) => u.id === payload.sub);
  if (!userRecord) {
    return jsonMessage("User not found", 404);
  }
  const user: User = {
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role,
    createdAt: userRecord.createdAt,
    avatarUrl: userRecord.avatarUrl,
  };
  const body: ApiResponse<{ user: User }> = { data: { user } };
  return jsonOk(body);
}
