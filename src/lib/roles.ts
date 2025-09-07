// src/lib/roles.ts
import { adminAuth } from "@/lib/admin";

export type UserRole = "user" | "partner" | "staff" | "admin" | "superadmin";

/**
 * Assign a role to a user by UID.
 * This sets a custom claim in Firebase Auth.
 */
export async function assignRole(uid: string, role: UserRole) {
  await adminAuth.setCustomUserClaims(uid, { role });
  return { uid, role, message: `Role '${role}' assigned to user ${uid}` };
}

/**
 * Get a user's role.
 */
export async function getUserRole(uid: string): Promise<UserRole> {
  const user = await adminAuth.getUser(uid);
  const claims = user.customClaims as { role?: UserRole };
  return claims?.role ?? "user";
}

/**
 * Check if a user has a required role (or higher).
 */
export async function hasRole(uid: string, roles: UserRole[]) {
  const role = await getUserRole(uid);
  return roles.includes(role);
}

/**
 * Role hierarchy (optional utility for future expansion).
 */
export function roleRank(role: UserRole): number {
  const ranks: Record<UserRole, number> = {
    user: 1,
    partner: 2,
    staff: 3,
    admin: 4,
    superadmin: 5,
  };
  return ranks[role];
}
