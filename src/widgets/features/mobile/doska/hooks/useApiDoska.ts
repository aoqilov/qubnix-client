import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import type {
  CreateOrganizationRequest,
  RawOrganization,
} from "@/api/organizations/organizations.types";
import type { WorkspaceSummary } from "@/store/workspace.store";

function toWorkspaceSummary(org: RawOrganization): WorkspaceSummary {
  return {
    id: org.id,
    name: org.name,
    initials: org.name.trim().charAt(0).toUpperCase() || "?",
    tasksCount: org.tasks_count ?? 0,
  };
}

export const DOSKA_KEYS = {
  workspaces: () => ["organizations"] as const,
  personal: () => ["personal"] as const,
};

export function useWorkspaceList() {
  return useQuery({
    queryKey: DOSKA_KEYS.workspaces(),
    queryFn: () => organizationsApi.list({ type: "organization", limit: 100 }),
    select: (data) => data.organizations.map(toWorkspaceSummary),
  });
}

export function usePersonalSummary() {
  return useQuery({
    queryKey: DOSKA_KEYS.personal(),
    queryFn: () => organizationsApi.list({ type: "personal", limit: 100 }),
    select: (data) => ({
      id: data.organizations[0]?.id,
      tasksCount: data.organizations[0]?.tasks_count ?? 0,
    }),
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationRequest) =>
      organizationsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.workspaces() });
    },
  });
}
