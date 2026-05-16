import type { User, UserRole } from "@/modules/auth/types";

/** Backend user shape (TypeORM entity JSON). */
export type NestUserDto = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  isBlocked?: boolean;
  createDate?: string | Date;
  createdAt?: string | Date;
};

function toIsoDate(value: string | Date | undefined): string {
  if (value == null) return new Date(0).toISOString();
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime())
    ? new Date(0).toISOString()
    : d.toISOString();
}

export function mapNestUserToClient(dto: NestUserDto): User {
  const createdAt = toIsoDate(dto.createdAt ?? dto.createDate);
  const role =
    dto.role === "admin" || dto.role === "customer"
      ? (dto.role as UserRole)
      : "customer";

  return {
    id: String(dto.id),
    name: dto.fullName,
    fullName: dto.fullName,
    email: dto.email,
    role,
    createdAt,
    isBlocked: dto.isBlocked ?? false,
    phoneNumber: dto.phoneNumber ?? undefined,
  };
}
