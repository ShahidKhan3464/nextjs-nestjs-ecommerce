/**
 * NestJS base URL for Next.js Route Handlers that proxy to the API (register, login, …).
 * Prefer server-only `BACKEND_URL` in production; `NEXT_PUBLIC_BACKEND_URL` is a fallback for local dev.
 */
export function getBackendUrl(): string {
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    "http://localhost:3001"
  ).replace(/\/$/, "");
}
