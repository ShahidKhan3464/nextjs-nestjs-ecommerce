import type { User } from "../types";
import { api } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";

export async function updateProfile(body: {
  name?: string;
  avatarUrl?: string;
}) {
  const res = await api.patch<ApiResponse<{ user: User }>>(
    "/api/v1/users/me",
    body
  );
  return res.data.data.user;
}
