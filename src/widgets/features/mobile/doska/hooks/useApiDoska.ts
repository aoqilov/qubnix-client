import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { organizationInvitationsApi } from "@/api/organization-invitations/organization-invitations.api";
import type {
  CreateOrganizationRequest,
  RawOrganization,
} from "@/api/organizations/organizations.types";
import type { InvitationAction } from "@/api/organization-invitations/organization-invitations.types";
import type { WorkspaceSummary } from "@/store/workspace.store";

function toWorkspaceSummary(org: RawOrganization): WorkspaceSummary {
  return {
    id: org.id,
    name: org.name,
    initials: org.name.trim().charAt(0).toUpperCase() || "?",
    tasksCount: org.tasks_count ?? 0,
    role: org.role,
  };
}

export const DOSKA_KEYS = {
  workspaces: () => ["organizations"] as const,
  personal: () => ["personal"] as const,
  invitations: () => ["organization-invitations", "received"] as const,
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

export function useReceivedInvitations() {
  return useQuery({
    queryKey: DOSKA_KEYS.invitations(),
    queryFn: () =>
      organizationInvitationsApi.listReceived({ status: "pending", limit: 100 }),
    select: (data) => data.invitations,
  });
}

export function useRespondInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: InvitationAction }) =>
      organizationInvitationsApi.respond(id, action),
    onSuccess: (_invitation, { action }) => {
      queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.invitations() });
      if (action === "accept") {
        queryClient.invalidateQueries({ queryKey: DOSKA_KEYS.workspaces() });
      }
    },
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
