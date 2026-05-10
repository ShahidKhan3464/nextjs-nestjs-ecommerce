/** Session JWT for middleware + Next Route Handlers (signed with this app's `JWT_SECRET`). */
export const AUTH_SESSION_COOKIE = "access_token";

/** Nest access JWT forwarded to the Nest API from Route Handlers (`Authorization` fallbacks). */
export const AUTH_BACKEND_ACCESS_COOKIE = "backend_access_token";
