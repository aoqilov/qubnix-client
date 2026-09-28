import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { DOSKA_KEYS } from "@/widgets/features/mobile/doska/hooks/useApiDoska";
import { SETTINGS_KEYS } from "@/widgets/features/mobile/settings/hooks/useApiSettings";
import { INVITATIONS_KEYS } from "@/widgets/features/mobile/settings-members/hooks/useApiInvitations";
import { MEMBERS_KEYS } from "@/widgets/features/mobile/settings-members/hooks/useApiSettingsMembers";
import { PROJECTS_KEYS } from "@/widgets/features/mobile/settings-projects/hooks/useApiSettingsProjects";
import type { SseEnvelope } from "./sse.types";

/** Butun tashkilot daraxti — faqat qamrovni aniqlab bo'lmaganda. */
const ALL_ORGANIZATIONS: QueryKey = ["organizations"];

/**
 * Hodisa -> invalidate qilinadigan query kalitlari.
 *
 * Kalitlar ierarxik: PROJECTS_KEYS.list(orgId) = ["organizations", orgId,
 * "projects"] bo'lib, vazifalar ro'yxati, loyiha task_counts'lari, kalendar
 * va member-statistics shu prefiks ostida yashaydi — mutatsiyalardagi bitta
 * invalidateQueries chaqiruvi bilan aynan bir xil qamrov.
 *
 * Doska'dagi `tasksCount` (workspace ro'yxati va shaxsiy karta) bu daraxtdan
 * tashqarida, shuning uchun vazifa hodisalarida alohida yangilanadi.
 *
 * Kalit quruvchilarni ataylab import qilamiz (nusxalab yozmaymiz), aks holda
 * feature tomonda kalit o'zgarsa bu yerdagi prefiks jimgina eskirib qoladi.
 */
function keysFor(envelope: SseEnvelope): QueryKey[] {
  const orgId = envelope.organization_id;

  // organization_id bo'lmasa aniq prefiksni bilmaymiz — hammasini yangilaymiz.
  if (!orgId) return [ALL_ORGANIZATIONS, DOSKA_KEYS.workspaces(), DOSKA_KEYS.personal()];

  const workspacesList = DOSKA_KEYS.workspaces();
  // ["organizations", orgId] — tashkilot obyekti, rol va butun ichki daraxt.
  const organizationScope = SETTINGS_KEYS.organization(orgId);
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
      return [projectsScope, workspacesList, DOSKA_KEYS.personal()];

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
      return [...invitationsScope, membersScope, workspacesList];

    case "organization.invitation.rejected":
    case "organization.invitation.cancelled":
      return [...invitationsScope, membersScope];

    case "organization.member.created":
      return [membersScope, workspacesList];

    case "organization.member.updated":
    case "organization.member.removed":
      // Rol o'zgarsa ko'rinadigan vazifalar va ruxsatlar ham o'zgaradi —
      // tashkilotning butun daraxti (rol so'rovi ham shu yerda) yangilanadi.
      return [organizationScope, workspacesList];

    default: {
      // Yangi hodisa turi SSE_EVENT_TYPES'ga qo'shilib, shu switch'ga
      // kiritilmasa — TypeScript aynan shu qatorda xato beradi.
      const unhandled: never = envelope.type;
      void unhandled;
      return [ALL_ORGANIZATIONS, workspacesList];
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

/**
 * Prefiksni "bo'sh" solishtirish: id backend javobida son (`11`), hodisada
 * esa matn (`"11"`) bo'lishi mumkin — React Query'ning standart qat'iy
 * solishtiruvida bunday kalitlar mos kelmaydi va hech narsa yangilanmaydi.
 */
function matchesKeyPrefix(queryKey: readonly unknown[], prefix: readonly unknown[]): boolean {
  if (queryKey.length < prefix.length) return false;

  return prefix.every((part, i) => {
    const actual = queryKey[i];
    if (part !== null && typeof part === "object") {
      return JSON.stringify(part) === JSON.stringify(actual);
    }
    if (actual !== null && typeof actual === "object") return false;
    return String(part) === String(actual);
  });
}

function scheduleInvalidate(queryClient: QueryClient, key: QueryKey): void {
  const id = JSON.stringify(key);
  const existing = pending.get(id);
  if (existing) clearTimeout(existing);

  pending.set(
    id,
    setTimeout(() => {
      pending.delete(id);
      const prefix = key as readonly unknown[];
      const predicate = (query: { queryKey: readonly unknown[] }) =>
        matchesKeyPrefix(query.queryKey, prefix);

      if (import.meta.env.DEV) {
        // Kalit hech bir so'rovga mos kelmasa — xarita yoki id turi noto'g'ri.
        const matched = queryClient.getQueryCache().findAll({ predicate });
        const active = matched.filter((q) => q.getObserversCount() > 0).length;
        console.info("[sse] invalidate", key, `mos: ${matched.length}, aktiv: ${active}`);
      }
      void queryClient.invalidateQueries({ predicate });
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
