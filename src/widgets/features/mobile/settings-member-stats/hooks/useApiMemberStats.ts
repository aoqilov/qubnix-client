import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/api/organizations/organizations.api";
import type {
  MemberStatisticsParams,
  RawMemberStatistics,
} from "@/api/organizations/organizations.types";
import type { MemberPickerItem } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import type { MemberStatsRow } from "../types";

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
