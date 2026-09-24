import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import type { OrganizationRole, RawOrganization } from "@/api/organizations/organizations.types";
import { useWorkspaceStore } from "@/store/workspace.store";

export interface SettingsWorkspace {
  id: string;
  name: string;
  initials: string;
  role: OrganizationRole;
}

function toSettingsWorkspace(org: RawOrganization): SettingsWorkspace {
  return {
    id: org.id,
    name: org.name,
    initials: org.name.trim().charAt(0).toUpperCase() || "?",
    role: org.role,
  };
}

export const SETTINGS_KEYS = {
  organization: (id: string) => ["organizations", id] as const,
  members: (id: string) => ["organizations", id, "members"] as const,
};

/** Joriy tanlangan workspace (organization) — "Настройка Workspace" sahifasi uchun. */
export function useSelectedOrganization() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);

  return useQuery({
    queryKey: SETTINGS_KEYS.organization(organizationId ?? ""),
    queryFn: () => organizationsApi.getById(organizationId!),
    select: toSettingsWorkspace,
    enabled: !!organizationId,
  });
}

/**
 * Xodimlar soni — alohida so'rov, chunki ro'yxat GET .../members orqali keladi.
 * Bu endpoint faqat admin/owner uchun ruxsat etilgan (member'da 403 qaytadi),
 * shuning uchun `enabled` orqali chaqiruvchi joriy rolni tekshirib beradi.
 */
export function useOrganizationMembersCount(enabled: boolean) {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);

  return useQuery({
    queryKey: SETTINGS_KEYS.members(organizationId ?? ""),
    queryFn: () => organizationsApi.listMembers(organizationId!),
    select: (data) => data.members.length,
    enabled: enabled && !!organizationId,
  });
}
