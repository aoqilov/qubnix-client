import i18n from "@/i18n";
import type { OrganizationRole } from "@/api/organizations/organizations.types";

type ProjectRole = "project_manager" | "project_member";

/**
 * Rol nomlari joriy tilda. O'zgarmas obyekt emas, funksiya — modul yuklanganda bir
 * marta hisoblangan matn til almashganda eskirib qolardi.
 */
export function organizationRoleLabel(role: OrganizationRole): string {
  return i18n.t(`common.roles.${role}`);
}

export function projectRoleLabel(role: ProjectRole): string {
  return i18n.t(`common.roles.${role}`);
}
