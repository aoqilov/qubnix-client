import { useEffect, useMemo, useState } from "react";
import { LuCalendarDays, LuSearchX } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { PeriodTabs } from "./components/PeriodTabs";
import { StatsFilterRow, type StatsSortOrder } from "./components/StatsFilterRow";
import { MemberPickerDrawer } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import { MemberStatCard } from "./components/MemberStatCard";
import { MemberStatsDayStrip } from "./components/MemberStatsDayStrip";
import { DayPickerDialog } from "./modals/DayPickerDialog";
import { useMemberStatistics, useMemberStatsDirectory } from "./hooks/useApiMemberStats";
import type { StatsMainTab, StatsPeriod } from "./types";
import { useWorkspaceStore } from "@/store/workspace.store";
import { toApiDate } from "@/utils/apiDate";
import { addDays, buildWeekDays, getWeekStart } from "@/utils/weekDays";
import { formatWeekdayDate } from "@/utils/formatWeekdayDate";

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

function CardSkeleton() {
  return <div className="h-[132px] animate-pulse rounded-card border border-subtle bg-surface" />;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuSearchX size={20} />
      </span>
      <p className="text-sm font-medium text-primary">Hech narsa topilmadi</p>
      <p className="text-xs text-secondary">Qidiruv yoki filtrni o'zgartirib ko'ring</p>
    </div>
  );
}

export default function FeatureSettingsMemberStats() {
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
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
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
  const scope =
    tab === "general" ? { from: range.from, to: range.to } : { date: toApiDate(selectedDay) };
  const directoryQuery = useMemberStatsDirectory(organizationId, scope);
  const directory = directoryQuery.data ?? [];
  // Hammasi tanlangan bo'lsa ham filtr yuborilmaydi — natija bir xil, URL qisqa.
  const isAllSelected =
    selectedMemberIds.length === 0 || selectedMemberIds.length === directory.length;

  const statsQuery = useMemberStatistics(organizationId, {
    ...scope,
    search: debouncedSearch || undefined,
    task_order: sortOrder === "most" ? "most_done" : "least_done",
    member_ids: isAllSelected ? undefined : selectedMemberIds.join(","),
    limit: 100,
  });
  const rows = statsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Статистика сотрудников" />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {tab === "general" ? range.label : formatWeekdayDate(selectedDay)}
      </p>

      <CusSegment
        value={tab}
        onValueChange={(v) => setTab(v as StatsMainTab)}
        items={[
          { id: "general", label: "Общее" },
          { id: "byDay", label: "По дням" },
        ]}
      />

      {tab === "general" ? (
        <PeriodTabs value={period} onChange={setPeriod} />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setDayPickerOpen(true)}
              aria-label="Выбрать дату"
              className="flex size-10 items-center justify-center rounded-card border border-default bg-surface text-secondary"
            >
              <LuCalendarDays size={18} />
            </button>
          </div>
          <MemberStatsDayStrip
            days={weekDays}
            direction={direction}
            onSelectDay={setSelectedDay}
            onPrevWeek={() => shiftWeek(-7)}
            onNextWeek={() => shiftWeek(7)}
          />
        </div>
      )}

      <StatsFilterRow
        value={search}
        onValueChange={setSearch}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onOpenMembersFilter={() => setMembersFilterOpen(true)}
      />

      {statsQuery.isError ? (
        <p className="px-1 text-sm text-error-strong">Не удалось загрузить статистику.</p>
      ) : statsQuery.isPending ? (
        <div className="flex flex-col gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <MemberStatCard key={row.memberId} row={row} />
          ))}
        </div>
      )}

      <MemberPickerDrawer
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
