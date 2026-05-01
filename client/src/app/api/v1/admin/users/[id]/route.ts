import type { User } from "@/types";
import type { ApiResponse } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/require-auth";
import { jsonMessage, jsonOk } from "@/lib/api-response";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  const record = MOCK_USERS.find((u) => u.id === id);
  if (!record) {
    return jsonMessage("User not found", 404);
  }
  const user: User = {
    id: record.id,
    email: record.email,
    name: record.name,
    role: record.role,
    createdAt: record.createdAt,
    avatarUrl: record.avatarUrl,
  };
  const body: ApiResponse<{ user: User }> = { data: { user } };
  return jsonOk(body);
}
