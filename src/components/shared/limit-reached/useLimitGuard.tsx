import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import { organizationInvitationsApi } from "@/api/organization-invitations/organization-invitations.api";
import { projectsApi } from "@/api/projects/projects.api";
import { orgSubscriptionQuery } from "@/queries/profile.queries";
import { useSelectedOrganization } from "@/hooks/useApiSettings";
import { PROJECTS_KEYS } from "@/components/shared/settings/projects/hooks/useApiSettingsProjects";
import { MEMBERS_KEYS } from "@/components/shared/settings/members/hooks/useApiSettingsMembers";
import { INVITATIONS_KEYS } from "@/components/shared/settings/members/hooks/useApiInvitations";
import { useWorkspaceStore } from "@/store/workspace.store";
import { WORKSPACE_ROLES } from "@/const/roles";
import { LimitReachedDrawer, type LimitResource } from "./LimitReachedDrawer";

/**
 * "Qo'shish" tugmasi uchun tarif limiti tekshiruvi.
 *
 * `guard(fn)` — limitga yetilmagan bo'lsa `fn`ni chaqiradi, yetilgan bo'lsa pastdan chiqadigan
 * `limitDrawer`ni ochadi (uni komponent ichida bir marta render qilish kerak). Shaxsiy workspace
 * va cheksiz (`null`) limit hech qachon bloklanmaydi; ma'lumot yuklanmagan paytda ham bloklanmaydi —
 * baribir server tekshiradi.
 *
 * Foydalanish soni kalitlari mavjud invalidatsiya prefikslari ostida (`PROJECTS_KEYS.list`,
 * `MEMBERS_KEYS.all`, `INVITATIONS_KEYS.sent`) — qo'shish/o'chirishdan keyin o'zi yangilanadi.
 * Routine'lar soni tashkilot darajasida olinmaydi: ularda limitga yetilganini server xatosi
 * (`openLimitDrawer`) bildiradi.
 */
export function useLimitGuard(resource: LimitResource): {
  guard: (onAllowed: () => void) => void;
  isLimitReached: boolean;
  openLimitDrawer: () => void;
  limitDrawer: ReactNode;
} {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const [isOpen, setOpen] = useState(false);
  const orgId = organizationId ?? "";
  const enabled = !!organizationId && !isPersonal;

  const organization = useSelectedOrganization().data;
  const subscription = useQuery({ ...orgSubscriptionQuery(orgId), enabled }).data;

  const projectsCount = useQuery({
    queryKey: [...PROJECTS_KEYS.list(orgId), "count"],
    queryFn: () => projectsApi.list(orgId, { limit: 1 }).then((r) => r.pagination.total),
    enabled: enabled && resource === "projects",
  }).data;

  const membersCount = useQuery({
    queryKey: [...MEMBERS_KEYS.all(orgId), "count"],
    queryFn: () => organizationsApi.listMembers(orgId, { limit: 1 }).then((r) => r.members_count),
    enabled: enabled && resource === "members",
  }).data;

  // Taklif qilingan, lekin hali javob bermaganlar ham joy egallaydi.
  const pendingInvites = useQuery({
    queryKey: [...INVITATIONS_KEYS.sent(orgId), "pending-count"],
    queryFn: () =>
      organizationInvitationsApi
        .listSent(orgId, { limit: 100 })
        .then((r) => r.invitations.filter((i) => i.status === "pending").length),
    enabled: enabled && resource === "members",
  }).data;

  const max = subscription?.limits[resource] ?? null;
  const used =
    resource === "projects"
      ? projectsCount
      : resource === "members"
        ? membersCount === undefined || pendingInvites === undefined
          ? undefined
          : membersCount + pendingInvites
        : undefined;
  const isLimitReached = enabled && max !== null && used !== undefined && used >= max;

  return {
    guard: (onAllowed) => (isLimitReached ? setOpen(true) : onAllowed()),
    isLimitReached,
    openLimitDrawer: () => setOpen(true),
    limitDrawer: (
      <LimitReachedDrawer
        open={isOpen}
        onClose={() => setOpen(false)}
        resource={resource}
        used={used}
        max={max}
        planName={subscription?.plan_name}
        organization={organizationId && organization ? { id: organizationId, name: organization.name } : undefined}
        isOwner={organization?.role === WORKSPACE_ROLES.OWNER}
      />
    ),
  };
}
