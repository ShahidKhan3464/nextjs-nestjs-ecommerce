import { cookies } from "next/headers";
import type { UserRole } from "@/types";
import type { ApiResponse } from "@/types";
import { getBackendUrl } from "@/lib/backend-url";
import { nestErrorMessage } from "@/lib/nest-http";
import { signAccessToken } from "@/lib/server-auth";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import {
  AUTH_SESSION_COOKIE,
  AUTH_BACKEND_ACCESS_COOKIE,
} from "@/lib/auth-cookies";

type NestRefreshPayload = {
  data?: {
    user?: {
      id: number;
      email: string;
      role?: string;
      fullName: string;
      accessToken: string;
      refreshToken: string;
    };
  };
  message?: string | string[];
};

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get("refresh_token")?.value;
  if (!refresh) {
    return jsonMessage("No refresh token", 401);
  }

  const res = await fetch(`${getBackendUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  let payload: NestRefreshPayload | null = null;
  try {
    payload = (await res.json()) as NestRefreshPayload;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    return jsonMessage(nestErrorMessage(payload), 401);
  }

  const u = payload?.data?.user;
  if (
    !u?.accessToken ||
    !u.refreshToken ||
    u.email === undefined ||
    u.id === undefined
  ) {
    return jsonMessage("Unexpected response from server", 502);
  }

  const role: UserRole =
    u.role === "ADMIN"
      ? "admin"
      : u.role === "CUSTOMER"
        ? "customer"
        : "customer";

  const displayName =
    typeof u.fullName === "string" && u.fullName.trim().length > 0
      ? u.fullName.trim()
      : u.email.split("@")[0] ?? "User";

  const sessionJwt = await signAccessToken({
    sub: String(u.id),
    email: u.email,
    role,
    name: displayName,
  });

  jar.set(AUTH_SESSION_COOKIE, sessionJwt, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 15,
    secure: process.env.NODE_ENV === "production",
  });
  jar.set(AUTH_BACKEND_ACCESS_COOKIE, u.accessToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 15,
    secure: process.env.NODE_ENV === "production",
  });
  jar.set("refresh_token", u.refreshToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  const body: ApiResponse<{ accessToken: string; expiresIn: number }> = {
    data: { accessToken: u.accessToken, expiresIn: 900 },
  };
  return jsonOk(body);
}
