import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-only-change-in-production-min-32-chars!!"
);

export interface JwtPayload {
  sub: string;
  email: string;
  role: "admin" | "customer";
  typ: "access" | "refresh";
}

export async function signAccessToken(payload: Omit<JwtPayload, "typ">) {
  const token = await new SignJWT({ ...payload, typ: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
  return token;
}

export async function signRefreshToken(payload: Omit<JwtPayload, "typ">) {
  const token = await new SignJWT({ ...payload, typ: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : "";
    const role =
      payload.role === "admin" || payload.role === "customer"
        ? payload.role
        : "customer";
    const typ =
      payload.typ === "access" || payload.typ === "refresh"
        ? payload.typ
        : "access";
    if (!sub) return null;
    return { sub, email, role, typ };
  } catch {
    return null;
  }
}
