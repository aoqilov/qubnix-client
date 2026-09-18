import type { OrganizationRole } from "@/api/organizations/organizations.types";

/** Tashkilot (workspace) darajasidagi rol nomlari — rus tilida, UI uchun. */
export const ORGANIZATION_ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "Владелец",
  admin: "Админ",
  member: "Участник",
  viewer: "Наблюдатель",
};
