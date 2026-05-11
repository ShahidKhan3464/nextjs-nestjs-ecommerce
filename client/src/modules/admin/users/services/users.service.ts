import type { User } from "@/types";
import { api } from "@/services/api/client";

export async function fetchAdminUsers() {
  const res = await api.get<{ data: { users: User[] } }>("/api/v1/admin/users");
  return res.data.data.users;
}

export async function fetchAdminUser(id: string) {
  const res = await api.get<{ data: { user: User } }>(
    `/api/v1/admin/users/${id}`
  );
  return res.data.data.user;
}
