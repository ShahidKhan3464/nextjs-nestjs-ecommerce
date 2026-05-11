import type { ApiResponse } from "@/types";
import { getBackendUrl } from "@/lib/backend-url";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import { forwardAuthorization, nestErrorMessage } from "@/lib/nest-http";

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const backend = getBackendUrl();
  const res = await fetch(`${backend}/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...forwardAuthorization(req) },
  });

  const text = await res.text();
  let raw: unknown = null;
  if (text) {
    try {
      raw = JSON.parse(text) as unknown;
    } catch {
      raw = { message: text };
    }
  }

  if (!res.ok) {
    return jsonMessage(nestErrorMessage(raw), res.status);
  }

  const body: ApiResponse<{ ok: true }> = { data: { ok: true } };
  return jsonOk(body);
}
