import type { ReactNode } from "react";

interface RoleGateProps<T extends string> {
  /**
   * Joriy foydalanuvchining shu yerda tekshiriladigan rol(lar)i — workspace
   * va project scope'laridan bir vaqtda berilishi mumkin, masalan
   * `[workspace.role, projectMemberRole]`.
   */
  roles: readonly T[];
  /** `roles` ichidan kamida bittasi shu ro'yxatda bo'lsa — children ko'rinadi. */
  allow: readonly T[];
  children: ReactNode;
}

/** `roles`dan hech bo'lmasa bittasi `allow`da bormi — JSX tashqarisida (masalan hook `enabled`da) ham ishlatish uchun. */
export function hasRole<T extends string>(roles: readonly T[], allow: readonly T[]): boolean {
  return roles.some((role) => allow.includes(role));
}

/** `roles`dan hech bo'lmasa bittasi `allow`da bo'lsa children'ni ko'rsatadi, aks holda hech nima render qilmaydi. */
export function RoleGate<T extends string>({ roles, allow, children }: RoleGateProps<T>) {
  if (!hasRole(roles, allow)) return null;
  return <>{children}</>;
}
