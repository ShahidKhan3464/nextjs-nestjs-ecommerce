import type { User } from "@/types";
import { cookies } from "next/headers";
import { MOCK_USERS } from "@/lib/mock-data";
import { verifyToken } from "@/lib/server-auth";
import { jsonMessage } from "@/lib/api-response";

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7);
}

export async function requireUser(req: Request): Promise<User | Response> {
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
  const record = MOCK_USERS.find((u) => u.id === payload.sub);
  if (!record) {
    return jsonMessage("User not found", 401);
  }
  const user: User = {
    id: record.id,
    name: record.name,
    role: record.role,
    email: record.email,
    createdAt: record.createdAt,
    avatarUrl: record.avatarUrl,
  };
  return user;
}

export async function requireAdmin(req: Request): Promise<User | Response> {
  const res = await requireUser(req);
  if (res instanceof Response) return res;
  if (res.role !== "admin") {
    return jsonMessage("Forbidden", 403);
  }
  return res;
}
