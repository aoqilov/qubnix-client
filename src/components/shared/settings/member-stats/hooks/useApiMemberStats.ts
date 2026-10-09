import { useQuery } from "@tanstack/react-query";
import { orgSubscriptionQuery } from "@/queries/profile.queries";
import { useWorkspaceStore } from "@/store/workspace.store";
import { organizationsApi } from "@/api/organizations/organizations.api";
import type {
  MemberStatisticsParams,
  RawMemberStatistics,
} from "@/api/organizations/organizations.types";
import type { MemberPickerItem } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import type { MemberStatsRow } from "@/components/shared/settings/member-stats/types";

export const MEMBER_STATS_KEYS = {
  /** `["organizations", id, "projects"]` prefiksi ostida — vazifa mutatsiyalari bilan birga yangilanadi. */
  list: (organizationId: string, params: MemberStatisticsParams) =>
    ["organizations", organizationId, "projects", "member-statistics", params] as const,
};

function fullName(m: RawMemberStatistics): string {
  return `${m.first_name} ${m.last_name}`.trim();
}

function toMemberStatsRow(m: RawMemberStatistics): MemberStatsRow {
  const t = m.totals;
  return {
    memberId: String(m.user_id),
    name: fullName(m),
    done: t.done,
    assigned: t.todo,
    inProgress: t.in_progress,
    overdue: t.not_done,
    percent: t.total > 0 ? Math.round((t.done / t.total) * 100) : 0,
  };
}

export function useMemberStatistics(
  organizationId: string | null,
  params: MemberStatisticsParams,
) {
  return useQuery({
    queryKey: MEMBER_STATS_KEYS.list(organizationId ?? "", params),
    queryFn: () => organizationsApi.memberStatistics(organizationId!, params),
    select: (data) => data.members.map(toMemberStatsRow),
    enabled: !!organizationId,
    // Qidiruv/filtr almashganda ro'yxat bo'shab, skeleton'ga sakramasin.
    placeholderData: (prev) => prev,
  });
}

/**
 * Xodimlar filtri drawer'i uchun — filtrsiz to'liq ro'yxat. `/members` o'rniga shu
 * endpoint: project manager ham ko'ra oladigan xodimlar aynan shu yerda qaytadi.
 */
export function useMemberStatsDirectory(
  organizationId: string | null,
  scope: Pick<MemberStatisticsParams, "date" | "from" | "to">,
) {
  const params = { ...scope, limit: 1000 };
  return useQuery({
    queryKey: MEMBER_STATS_KEYS.list(organizationId ?? "", params),
    queryFn: () => organizationsApi.memberStatistics(organizationId!, params),
    select: (data): MemberPickerItem[] =>
      data.members.map((m) => ({ id: String(m.user_id), name: fullName(m) })),
    enabled: !!organizationId,
  });
}

export interface StatsAccess {
  /** "Общее" (7/15/30 kun) tabi — faqat bugundan ko'proq ko'rsatadigan tarifda. */
  canUseGeneral: boolean;
  /** "По дням" da boshqa kunni tanlash (lenta va kalendar). */
  canPickDay: boolean;
  /** Eng eski ko'rish mumkin bo'lgan kun; null — cheklanmagan. */
  minDate: Date | null;
}

const FULL_ACCESS: StatsAccess = { canUseGeneral: true, canPickDay: true, minDate: null };

/**
 * Tarifdagi `limits.stats` (`today` | `3months` | `full`) bo'yicha statistika qanchalik orqaga
 * ochiq. Shaxsiy workspace va ma'lumot yuklanmaguncha cheklov qo'yilmaydi — baribir server tekshiradi.
 */
export function useStatsAccess(): StatsAccess {
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const depth = useQuery({
    ...orgSubscriptionQuery(organizationId ?? ""),
    select: (subscription) => subscription.limits.stats,
    enabled: !!organizationId && !isPersonal,
  }).data;

  if (depth === "today") return { canUseGeneral: false, canPickDay: false, minDate: null };
  if (depth === "3months") {
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 3);
    minDate.setHours(0, 0, 0, 0);
    return { canUseGeneral: true, canPickDay: true, minDate };
  }
  return FULL_ACCESS;
}
