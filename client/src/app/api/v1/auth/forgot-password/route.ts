import { z } from "zod";
import type { ApiResponse } from "@/types";
import { jsonMessage, jsonOk } from "@/lib/api-response";

const bodySchema = z.object({
  email: z.string().email(),
});

/** Demo: always succeeds — wire to email provider in production. */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonMessage("Invalid JSON body", 400);
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return jsonMessage("Validation failed", 422);
  }
  const payload: ApiResponse<{ sent: boolean }> = {
    data: { sent: true },
    meta: { note: "Reset link would be emailed in production." },
  };
  return jsonOk(payload);
}
