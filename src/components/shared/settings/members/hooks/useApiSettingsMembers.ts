import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import type { OrganizationMemberRole } from "@/api/organizations/organizations.types";
import { useWorkspaceStore } from "@/store/workspace.store";

export const MEMBERS_KEYS = {
  all: (organizationId: string) => ["organizations", organizationId, "members"] as const,
  list: (organizationId: string, role?: OrganizationMemberRole) =>
    ["organizations", organizationId, "members", "list", role ?? "all"] as const,
};

/** GET /api/v1/organizations/{organizationID}/members — /settings/members ro'yxati, `role` server tomonda filtrlanadi. */
export function useOrganizationMembers(role?: OrganizationMemberRole) {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);

  return useQuery({
    queryKey: MEMBERS_KEYS.list(organizationId ?? "", role),
    queryFn: () =>
      organizationsApi.listMembers(organizationId!, { limit: 100, role }),
    enabled: !!organizationId,
  });
}

/** PATCH .../members/{user_id} — xodim rolini o'zgartirish. */
export function useUpdateMemberRole() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: OrganizationMemberRole }) =>
      organizationsApi.updateMemberRole(organizationId!, userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.all(organizationId ?? "") });
    },
  });
}

/** DELETE .../members/{user_id} — xodimni tashkilotdan chiqarish. */
export function useRemoveMember() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => organizationsApi.removeMember(organizationId!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.all(organizationId ?? "") });
    },
  });
}
