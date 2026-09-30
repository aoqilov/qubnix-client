import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { LuCalendarDays, LuSearchX } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { MemberPickerDrawer } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import { PeriodTabs } from "@/components/shared/settings/member-stats/components/PeriodTabs";
import {
  StatsFilterRow,
  type StatsSortOrder,
} from "@/components/shared/settings/member-stats/components/StatsFilterRow";
import { MemberStatCard } from "@/components/shared/settings/member-stats/components/MemberStatCard";
import { MemberStatsDayStrip } from "@/components/shared/settings/member-stats/components/MemberStatsDayStrip";
import { DayPickerDialog } from "@/components/shared/settings/member-stats/modals/DayPickerDialog";
import {
  useMemberStatistics,
  useMemberStatsDirectory,
} from "@/components/shared/settings/member-stats/hooks/useApiMemberStats";
import type { StatsMainTab, StatsPeriod } from "@/components/shared/settings/member-stats/types";
import { useWorkspaceStore } from "@/store/workspace.store";
import { toApiDate } from "@/utils/apiDate";
import { addDays, buildWeekDays, getWeekStart } from "@/utils/weekDays";
import { formatWeekdayDate } from "@/utils/formatWeekdayDate";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";

const GRID_CLASS = "grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3";

function formatDayMonth(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** 7/15/30 kun — bugun bilan tugaydigan davr. */
function periodRange(period: StatsPeriod) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (Number(period) - 1));
  return {
    from: toApiDate(from),
    to: toApiDate(to),
    label: `${formatDayMonth(from)} – ${formatDayMonth(to)}.${to.getFullYear()}`,
  };
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuSearchX size={20} />
      </span>
      <p className="text-sm font-medium text-primary">{t("common.states.nothingFound")}</p>
      <p className="text-xs text-secondary">{t("common.states.nothingFoundHint")}</p>
    </div>
  );
}

export default function FeatureSettingsMemberStats() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<StatsMainTab>("general");
  const [period, setPeriod] = useState<StatsPeriod>("7");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<StatsSortOrder>("most");
  // Bo'sh massiv — "hamma xodimlar" (member_ids yuborilmaydi).
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isMembersFilterOpen, setMembersFilterOpen] = useState(false);

  // Qidiruv serverda — har bir harfda so'rov ketmasligi uchun 300ms kechiktiriladi.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  // "По дням" — bitta kun: lentadan yoki to'liq kalendardan tanlanadi.
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [direction, setDirection] = useState(0);
  const [isDayPickerOpen, setDayPickerOpen] = useState(false);
  const weekDays = useMemo(() => buildWeekDays(weekStart, selectedDay), [weekStart, selectedDay]);

  function shiftWeek(offsetDays: number) {
    setDirection(offsetDays > 0 ? 1 : -1);
    setWeekStart((prev) => addDays(prev, offsetDays));
  }

  function pickDay(date: Date) {
    const nextWeekStart = getWeekStart(date);
    setDirection(Math.sign(nextWeekStart.getTime() - weekStart.getTime()));
    setWeekStart(nextWeekStart);
    setSelectedDay(date);
    setDayPickerOpen(false);
  }

  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const range = periodRange(period);
  // "Общее" — davr (from/to), "По дням" — faqat bitta `date`.
  const scope = tab === "general" ? { from: range.from, to: range.to } : { date: toApiDate(selectedDay) };
  const directoryQuery = useMemberStatsDirectory(organizationId, scope);
  const directory = directoryQuery.data ?? [];
  // Hammasi tanlangan bo'lsa ham filtr yuborilmaydi — natija bir xil, URL qisqa.
  const isAllSelected = selectedMemberIds.length === 0 || selectedMemberIds.length === directory.length;

  const statsQuery = useMemberStatistics(organizationId, {
    ...scope,
    search: debouncedSearch || undefined,
    task_order: sortOrder === "most" ? "most_done" : "least_done",
    member_ids: isAllSelected ? undefined : selectedMemberIds.join(","),
    limit: 100,
  });
  const rows = statsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionHeader
        title={t("memberStats.title")}
        subtitle={tab === "general" ? range.label : formatWeekdayDate(selectedDay)}
      />

      <div className="flex flex-col items-start gap-3">
        <CusSegment
          layout="inline"
          value={tab}
          onValueChange={(v) => setTab(v as StatsMainTab)}
          items={[
            { id: "general", label: t("memberStats.tabs.general") },
            { id: "byDay", label: t("memberStats.tabs.byDay") },
          ]}
        />
        {tab === "general" && <PeriodTabs value={period} onChange={setPeriod} />}
      </div>

      {tab === "byDay" && (
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <MemberStatsDayStrip
              days={weekDays}
              direction={direction}
              onSelectDay={setSelectedDay}
              onPrevWeek={() => shiftWeek(-7)}
              onNextWeek={() => shiftWeek(7)}
            />
          </div>
          <button
            type="button"
            onClick={() => setDayPickerOpen(true)}
            aria-label={t("memberStats.pickDate")}
            className="flex size-10 flex-none items-center justify-center self-end rounded-input border border-default bg-surface text-secondary hover:border-focus"
          >
            <LuCalendarDays size={18} />
          </button>
        </div>
      )}

      <div className="max-w-xl">
        <StatsFilterRow
          value={search}
          onValueChange={setSearch}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onOpenMembersFilter={() => setMembersFilterOpen(true)}
        />
      </div>

      {statsQuery.isError ? (
        <p className="text-sm text-error-strong">{t("memberStats.loadError")}</p>
      ) : statsQuery.isPending ? (
        <div className={GRID_CLASS}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[132px] animate-pulse rounded-card border border-subtle bg-surface" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={GRID_CLASS}>
          {rows.map((row) => (
            <MemberStatCard key={row.memberId} row={row} />
          ))}
        </div>
      )}

      <MemberPickerDrawer
        variant="dialog"
        open={isMembersFilterOpen}
        onClose={() => setMembersFilterOpen(false)}
        members={directory}
        selectedIds={selectedMemberIds}
        onApply={setSelectedMemberIds}
      />

      <DayPickerDialog
        open={isDayPickerOpen}
        onClose={() => setDayPickerOpen(false)}
        value={selectedDay}
        onPick={pickDay}
      />
    </div>
  );
}
