import { z } from "zod";
import type { User } from "@/types";
import type { ApiResponse } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { requireUser } from "@/lib/require-auth";
import { jsonMessage, jsonOk } from "@/lib/api-response";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export async function GET(req: Request) {
  const res = await requireUser(req);
  if (res instanceof Response) return res;
  const body: ApiResponse<{ user: User }> = { data: { user: res } };
  return jsonOk(body);
}

export async function PATCH(req: Request) {
  const user = await requireUser(req);
  if (user instanceof Response) return user;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return jsonMessage("Invalid payload", 422);
  }

  const record = MOCK_USERS.find((u) => u.id === user.id);
  if (!record) {
    return jsonMessage("User not found", 404);
  }
  if (parsed.data.name !== undefined) {
    record.name = parsed.data.name;
  }
  if (parsed.data.avatarUrl !== undefined) {
    record.avatarUrl = parsed.data.avatarUrl || undefined;
  }

  const next: User = {
    id: record.id,
    email: record.email,
    name: record.name,
    role: record.role,
    fullName: record.fullName,
    isBlocked: record.isBlocked,
    createdAt: record.createdAt,
    avatarUrl: record.avatarUrl,
  };
  const body: ApiResponse<{ user: User }> = { data: { user: next } };
  return jsonOk(body);
}
