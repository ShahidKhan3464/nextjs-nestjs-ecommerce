import { z } from "zod";
import type { User } from "@/types";
import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import {
  signAccessToken,
  signRefreshToken,
} from "@/lib/server-auth";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return jsonMessage("Validation failed", 422);
  }
  const { name, email, password } = parsed.data;
  const exists = MOCK_USERS.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return jsonMessage("Email already registered", 409);
  }

  const id = `u${MOCK_USERS.length + 1}`;
  const userRecord = {
    id,
    email,
    name,
    role: "customer" as const,
    password,
    createdAt: new Date().toISOString(),
  };
  MOCK_USERS.push(userRecord);

  const base = { sub: userRecord.id, email: userRecord.email, role: userRecord.role };
  const accessToken = await signAccessToken(base);
  const refreshToken = await signRefreshToken(base);

  const jar = await cookies();
  jar.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });
  jar.set("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const user: User = {
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role,
    createdAt: userRecord.createdAt,
  };

  const payload: ApiResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> = {
    data: {
      user,
      accessToken,
      refreshToken,
      expiresIn: 900,
    },
  };
  return jsonOk(payload);
}
