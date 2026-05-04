import { useAuthStore } from "@/store/auth-store";
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/** Browser: same-origin `/api/v1/*` (Route Handlers → Nest). Server: absolute URL to this Next app so paths resolve correctly. */
const base =
  typeof window !== "undefined"
    ? ""
    : (
        process.env.NEXT_PUBLIC_API_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000"
      ).replace(/\/$/, "");

export const api = axios.create({
  withCredentials: true,
  baseURL: base || undefined,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig | undefined;
    if (
      !original ||
      original.url?.includes("/auth/refresh") ||
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/reset-password")
    ) {
      return Promise.reject(error);
    }
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      const res = await axios.post<{ data: { accessToken: string } }>(
        `${base}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const accessToken = res.data.data.accessToken;
      useAuthStore.getState().setAccessToken(accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch {
      useAuthStore.getState().clearSession();
      return Promise.reject(error);
    }
  }
);
