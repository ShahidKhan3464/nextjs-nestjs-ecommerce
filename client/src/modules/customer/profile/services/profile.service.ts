import type { User } from "../types";
import { api } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";

export async function fetchProfile() {
  const res = await api.get<ApiResponse<{ user: User }>>("/api/v1/users/me");
  return res.data.data.user;
}

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
