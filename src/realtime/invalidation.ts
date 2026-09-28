import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { DOSKA_KEYS } from "@/widgets/features/mobile/doska/hooks/useApiDoska";
import { INVITATIONS_KEYS } from "@/widgets/features/mobile/settings-members/hooks/useApiInvitations";
import { MEMBERS_KEYS } from "@/widgets/features/mobile/settings-members/hooks/useApiSettingsMembers";
import { PROJECTS_KEYS } from "@/widgets/features/mobile/settings-projects/hooks/useApiSettingsProjects";
import type { SseEnvelope } from "./sse.types";

/**
 * Hodisa -> invalidate qilinadigan query kalitlari.
 *
 * Kalitlar ierarxik: PROJECTS_KEYS.list(orgId) = ["organizations", orgId,
 * "projects"] bo'lib, vazifalar ro'yxati, loyiha task_counts'lari, kalendar
 * va member-statistics shu prefiks ostida yashaydi — mutatsiyalardagi bitta
 * invalidateQueries chaqiruvi bilan aynan bir xil qamrov.
 *
 * Kalit quruvchilarni ataylab import qilamiz (nusxalab yozmaymiz), aks holda
 * feature tomonda kalit o'zgarsa bu yerdagi prefiks jimgina eskirib qoladi.
 */
function keysFor(envelope: SseEnvelope): QueryKey[] {
  const orgId = envelope.organization_id;

  // organization_id bo'lmasa aniq prefiksni bilmaymiz — butun "organizations"
  // daraxtini yangilaymiz (kalitlar prefiks bo'yicha mos keladi).
  if (!orgId) return [DOSKA_KEYS.workspaces()];

  const projectsScope = PROJECTS_KEYS.list(orgId);
  const membersScope = MEMBERS_KEYS.all(orgId);
  const invitationsScope = [INVITATIONS_KEYS.sent(orgId), DOSKA_KEYS.invitations()];

  switch (envelope.type) {
    case "task.created":
    case "task.updated":
    case "task.deleted":
    case "task.status_changed":
    case "task.assignees_changed":
    case "task.subtasks_changed":
    case "task.access_revoked":
    case "routine.task_created":
    case "project.created":
    case "project.updated":
    case "project.deleted":
      return [projectsScope];

    case "project.member_added":
    case "project.member_removed":
      return [projectsScope, membersScope];

    case "organization.invitation.created":
      return invitationsScope;

    case "organization.invitation.accepted":
      // Taklif qabul qilinsa foydalanuvchida yangi workspace paydo bo'ladi.
      return [...invitationsScope, membersScope, DOSKA_KEYS.workspaces()];

    case "organization.invitation.rejected":
    case "organization.invitation.cancelled":
      return [...invitationsScope, membersScope];

    default: {
      // Yangi hodisa turi SSE_EVENT_TYPES'ga qo'shilib, shu switch'ga
      // kiritilmasa — TypeScript aynan shu qatorda xato beradi.
      const unhandled: never = envelope.type;
      void unhandled;
      return [DOSKA_KEYS.workspaces()];
    }
  }
}

/**
 * Bir amaldan keyin hodisalar to'p bo'lib kelishi mumkin (masalan `updated` +
 * `assignees_changed` + `subtasks_changed`). Har biriga alohida refetch
 * yubormaslik uchun kalit bo'yicha qisqa debounce.
 */
const COALESCE_MS = 300;
const pending = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleInvalidate(queryClient: QueryClient, key: QueryKey): void {
  const id = JSON.stringify(key);
  const existing = pending.get(id);
  if (existing) clearTimeout(existing);

  pending.set(
    id,
    setTimeout(() => {
      pending.delete(id);
      void queryClient.invalidateQueries({ queryKey: key });
    }, COALESCE_MS),
  );
}

export function invalidateForEvent(queryClient: QueryClient, envelope: SseEnvelope): void {
  for (const key of keysFor(envelope)) scheduleInvalidate(queryClient, key);
}

export function cancelPendingInvalidations(): void {
  for (const timer of pending.values()) clearTimeout(timer);
  pending.clear();
}

/**
 * (Qayta) ulanishdan keyingi to'liq sinxronizatsiya. Server hodisa tarixini
 * saqlamaydi, ya'ni uzilish davrida nima o'zgarganini bilmaymiz — barcha
 * aktiv so'rovlarni yangilaymiz.
 */
export function resyncAll(queryClient: QueryClient): void {
  cancelPendingInvalidations();
  void queryClient.invalidateQueries();
}
