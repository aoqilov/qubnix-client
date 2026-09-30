import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationInvitationsApi } from "@/api/organization-invitations/organization-invitations.api";
import type {
  CreateInvitationRequest,
  InvitationAction,
} from "@/api/organization-invitations/organization-invitations.types";
import { useWorkspaceStore } from "@/store/workspace.store";

export const INVITATIONS_KEYS = {
  search: (organizationId: string, query: string) =>
    ["organizations", organizationId, "invitations", "search", query] as const,
  sent: (organizationId: string) =>
    ["organizations", organizationId, "invitations", "sent"] as const,
};

/** GET /api/v1/organizations/{organizationID}/invitations — shu tashkilotdan yuborilgan barcha takliflar. */
export function useSentInvitations() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);

  return useQuery({
    queryKey: INVITATIONS_KEYS.sent(organizationId ?? ""),
    queryFn: () => organizationInvitationsApi.listSent(organizationId!, { limit: 100 }),
    enabled: !!organizationId,
  });
}

/** GET .../invitations/search — taklif qilishdan oldin ro'yxatdan o'tgan xodimni ism/username bo'yicha topadi. */
export function useSearchEmployee(query: string) {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const trimmed = query.trim();

  return useQuery({
    queryKey: INVITATIONS_KEYS.search(organizationId ?? "", trimmed),
    queryFn: () => organizationInvitationsApi.searchEmployee(organizationId!, { query: trimmed }),
    enabled: !!organizationId && trimmed.length >= 3,
    retry: false,
  });
}

/** POST /api/v1/organizations/{organizationID}/invitations — faqat owner/admin. */
export function useCreateInvitation() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvitationRequest) =>
      organizationInvitationsApi.create(organizationId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_KEYS.sent(organizationId ?? "") });
    },
  });
}

/** POST /api/v1/organization-invitations/{invitation_id}/respond — bekor qilish uchun `action: "reject"`. */
export function useRespondToInvitation() {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invitationId, action }: { invitationId: string; action: InvitationAction }) =>
      organizationInvitationsApi.respond(invitationId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_KEYS.sent(organizationId ?? "") });
    },
  });
}
