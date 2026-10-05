import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { organizationInvitationsApi } from "@/api/organization-invitations/organization-invitations.api";
import type { RawOrganization } from "@/api/organizations/organizations.types";
import type { InvitationAction } from "@/api/organization-invitations/organization-invitations.types";
import type { WorkspaceSummary } from "@/store/workspace.store";

/**
 * /doska — mobil va desktop uchun umumiy qatlam: query kalitlari, so'rovlar va
 * mutation'lar (nima chaqiriladi, nima yangilanadi) shu yerda bitta. Platforma
 * feature'lari (`widgets/features/<platform>/doska/hooks/useApiDoska.ts`) shu
 * ustida yupqa hook yozadi — kalit ikki joyda farq qilib, kesh/SSE yangilanishi
 * bir platformada ishlamay qolmasligi uchun.
 */

export function toWorkspaceSummary(org: RawOrganization): WorkspaceSummary {
  return {
    // Backend ba'zan id'ni son sifatida qaytaradi; localStorage'dagi
    // selectedWorkspaceId esa doim string — String() bo'lmasa Sidebar'dagi
    // `w.id === selectedWorkspaceId` (2 === "2") mos kelmay qoladi.
    id: String(org.id),
    name: org.name,
    initials: org.name.trim().charAt(0).toUpperCase() || "?",
    tasksCount: org.tasks_count ?? 0,
    role: org.role,
  };
}

export const DOSKA_KEYS = {
  /** `["organizations"]` emas: u butun tashkilot daraxtining prefiksi bo'lib,
   * ro'yxatni yangilash ilovadagi barcha so'rovlarni qayta yuklardi. */
  workspaces: () => ["organizations", "list"] as const,
  personal: () => ["personal"] as const,
  invitations: () => ["organization-invitations", "received"] as const,
};

/** Foydalanuvchi a'zo bo'lgan tashkilotlar (personal'siz). */
export const workspaceListQuery = () =>
  queryOptions({
    queryKey: DOSKA_KEYS.workspaces(),
    queryFn: () => organizationsApi.list({ type: "organization", limit: 100 }),
    select: (data) => data.organizations.map(toWorkspaceSummary),
  });

/** Shaxsiy maydon — id (tanlash uchun) va bugungi vazifalar soni. */
export const personalSummaryQuery = () =>
  queryOptions({
    queryKey: DOSKA_KEYS.personal(),
    queryFn: () => organizationsApi.list({ type: "personal", limit: 100 }),
    select: (data) => ({
      id: data.organizations[0] ? String(data.organizations[0].id) : undefined,
      tasksCount: data.organizations[0]?.tasks_count ?? 0,
    }),
  });

/** Kutilayotgan (pending) kelgan taklifnomalar. */
export const receivedInvitationsQuery = () =>
  queryOptions({
    queryKey: DOSKA_KEYS.invitations(),
    queryFn: () => organizationInvitationsApi.listReceived({ status: "pending", limit: 100 }),
    select: (data) => data.invitations,
  });

export function useRespondInvitationMutation() {
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
