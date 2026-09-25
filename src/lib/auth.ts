import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-config";

export type StaffRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "COUNSELLOR"
  | "CASE_MANAGER"
  | "CONTENT_MANAGER"
  | "FINANCE";

export const STAFF_ROLES: StaffRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "COUNSELLOR",
  "CASE_MANAGER",
  "CONTENT_MANAGER",
  "FINANCE"
];

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");
  return session;
}

export async function requireStaff() {
  const session = await requireSession();
  if (!session.user.role || session.user.role === "CLIENT") {
    redirect("/admin/login");
  }
  return session;
}

export async function requireRole(...roles: StaffRole[]) {
  const session = await requireStaff();
  if (!roles.includes(session.user.role as StaffRole)) {
    redirect("/admin");
  }
  return session;
}

export function hasRole(role: string | undefined, ...allowed: StaffRole[]) {
  return Boolean(role && allowed.includes(role as StaffRole));
}
