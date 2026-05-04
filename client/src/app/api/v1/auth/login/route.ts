import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/backend-url";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import type { ApiResponse, User, UserRole } from "@/types";

const DEFAULT_ROLE: UserRole = "customer";

/** Nest wraps controller return values with DataResponseInterceptor: `{ data, version }`. */
type NestLoginPayload = {
  data?: {
    user?: {
      id: number;
      email: string;
      fullName: string;
      accessToken: string;
      refreshToken: string;
    };
  };
  statusCode?: number;
  message?: string | string[];
};

function nestErrorMessage(payload: NestLoginPayload | null): string {
  const raw = payload?.message;
  if (Array.isArray(raw)) return raw.join(", ");
  if (typeof raw === "string") return raw;
  return "Invalid email or password";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }

  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { email?: unknown }).email !== "string" ||
    typeof (body as { password?: unknown }).password !== "string"
  ) {
    return jsonMessage("Invalid credentials payload", 422);
  }

  const { email, password } = body as { email: string; password: string };

  const res = await fetch(`${getBackendUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let payload: NestLoginPayload | null = null;
  try {
    payload = (await res.json()) as NestLoginPayload;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    return jsonMessage(nestErrorMessage(payload), res.status === 401 ? 401 : res.status);
  }

  const u = payload?.data?.user;
  if (
    !u?.accessToken ||
    !u.refreshToken ||
    u.email === undefined ||
    u.fullName === undefined ||
    u.id === undefined
  ) {
    return jsonMessage("Unexpected response from server", 502);
  }

  const jar = await cookies();
  jar.set("access_token", u.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });
  jar.set("refresh_token", u.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const user: User = {
    id: String(u.id),
    email: u.email,
    name: u.fullName,
    role: DEFAULT_ROLE,
    createdAt: new Date().toISOString(),
  };

  const response: ApiResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
    // expiresIn: number;
  }> = {
    data: {
      user,
      accessToken: u.accessToken,
      refreshToken: u.refreshToken,
      // expiresIn: 900,
    },
  };

  return jsonOk(response);
}
