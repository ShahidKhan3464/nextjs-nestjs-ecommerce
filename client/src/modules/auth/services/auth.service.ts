import { api } from "@/services/api/client";
import type { ApiResponse, User } from "@/types";

export async function loginRequest(email: string, password: string) {
  const res = await api.post<
    ApiResponse<{
      user: User;
      expiresIn: number;
      accessToken: string;
      refreshToken: string;
    }>
  >("/api/v1/auth/login", { email, password });
  return res.data.data;
}

export async function registerRequest(body: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post<
    ApiResponse<{
      user: User;
      expiresIn: number;
      accessToken: string;
      refreshToken: string;
    }>
  >("/api/v1/auth/register", body);
  return res.data.data;
}

export async function forgotPasswordRequest(email: string) {
  const res = await api.post<ApiResponse<{ sent: boolean }>>(
    "/api/v1/auth/forgot-password",
    { email }
  );
  return res.data.data;
}

export async function logoutRequest() {
  await api.post<ApiResponse<{ ok: true }>>("/api/v1/auth/logout");
}

export async function fetchSession() {
  const res = await api.get<ApiResponse<{ user: User }>>("/api/v1/auth/me");
  return res.data.data.user;
}
