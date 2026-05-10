import type { ApiResponse } from "@/types";
import { getBackendUrl } from "@/lib/backend-url";
import { jsonMessage, jsonOk } from "@/lib/api-response";
import { forwardAuthorization, nestErrorMessage } from "@/lib/nest-http";

type NestCategory = {
  id: number;
  name: string;
  description?: string | null;
};

type NestPagedEnvelope = {
  data?: {
    page?: number;
    limit?: number;
    total?: number;
    data?: NestCategory[];
  };
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qs = url.searchParams.toString();
  const backend = getBackendUrl();
  const res = await fetch(`${backend}/categories${qs ? `?${qs}` : ""}`, {
    headers: { ...forwardAuthorization(req) },
  });

  let raw: unknown = null;
  try {
    raw = await res.json();
  } catch {
    raw = null;
  }

  if (!res.ok) {
    return jsonMessage(nestErrorMessage(raw), res.status);
  }

  const envelope = raw as NestPagedEnvelope;
  const inner = envelope?.data;
  if (!inner || !Array.isArray(inner.data)) {
    return jsonMessage("Unexpected categories response", 502);
  }

  const body: ApiResponse<{
    categories: NestCategory[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> = {
    data: {
      categories: inner.data,
      pagination: {
        page: inner.page ?? 1,
        limit: inner.limit ?? 10,
        total: inner.total ?? inner.data.length,
        totalPages: Math.max(
          1,
          Math.ceil(
            (inner.total ?? inner.data.length) / (inner.limit ?? 10)
          )
        ),
      },
    },
  };

  return jsonOk(body);
}
