import type { User } from "@/types";
import type { ApiResponse } from "@/types";
import { jsonOk } from "@/lib/api-response";
import { MOCK_USERS } from "@/lib/mock-data";
import { requireAdmin } from "@/lib/require-auth";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const users: User[] = MOCK_USERS.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    avatarUrl: u.avatarUrl,
  }));
  users.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const body: ApiResponse<{ users: User[] }> = { data: { users } };
  return jsonOk(body);
}
