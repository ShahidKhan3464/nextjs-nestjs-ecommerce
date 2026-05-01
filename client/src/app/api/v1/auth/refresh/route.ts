import { cookies } from "next/headers";
import type { ApiResponse } from "@/types";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import { signAccessToken, verifyToken } from "@/lib/server-auth";

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get("refresh_token")?.value;
  if (!refresh) {
    return jsonMessage("No refresh token", 401);
  }
  const payload = await verifyToken(refresh);
  if (!payload || payload.typ !== "refresh") {
    return jsonMessage("Invalid refresh token", 401);
  }

  const accessToken = await signAccessToken({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  });
  jar.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });

  const body: ApiResponse<{ accessToken: string; expiresIn: number }> = {
    data: { accessToken, expiresIn: 900 },
  };
  return jsonOk(body);
}
