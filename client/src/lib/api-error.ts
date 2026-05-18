import { isAxiosError } from "axios";

function messageFromPayload(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const raw = (data as { message?: unknown }).message;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (Array.isArray(raw)) {
    const parts = raw.filter((x): x is string => typeof x === "string" && x.trim());
    if (parts.length > 0) return parts.join(", ");
  }
  const error = (data as { error?: unknown }).error;
  if (typeof error === "string" && error.trim()) return error.trim();
  return null;
}

/** Extract a user-facing message from API/axios errors (Nest or Next route handlers). */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  if (isAxiosError(error)) {
    const fromBody = messageFromPayload(error.response?.data);
    if (fromBody) return fromBody;
    if (error.message?.trim()) return error.message;
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

export function isAccountBlockedMessage(message: string): boolean {
  return message.toLowerCase().includes("blocked");
}
