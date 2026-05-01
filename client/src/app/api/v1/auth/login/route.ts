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
  email: z.string().email(),
  password: z.string().min(1),
});

function sanitizeUser(u: (typeof MOCK_USERS)[number]): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    avatarUrl: u.avatarUrl,
  };
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return jsonMessage("Invalid credentials payload", 422);
  }
  const { email, password } = parsed.data;
  const userRecord = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!userRecord || userRecord.password !== password) {
    return jsonMessage("Invalid email or password", 401);
  }

  const base = {
    sub: userRecord.id,
    email: userRecord.email,
    role: userRecord.role,
  };
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

  const user = sanitizeUser(userRecord);
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
