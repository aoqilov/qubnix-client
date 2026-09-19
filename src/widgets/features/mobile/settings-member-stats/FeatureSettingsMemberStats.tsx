import { useMemo, useState } from "react";
import { LuSearchX } from "react-icons/lu";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { PeriodTabs } from "./components/PeriodTabs";
import { StatsFilterRow, type StatsSortOrder } from "./components/StatsFilterRow";
import { MemberPickerDrawer } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import { MemberStatCard } from "./components/MemberStatCard";
import { DailyStatsList } from "./components/DailyStatsList";
import {
  MOCK_DAILY_STATS,
  MOCK_MEMBER_STATS,
  MOCK_PERIOD_RANGES,
  MOCK_STATS_MEMBERS,
} from "./lib/mockMemberStats";
import type { StatsMainTab, StatsPeriod } from "./types";

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
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(() =>
    MOCK_STATS_MEMBERS.map((member) => member.id),
  );
  const [isMembersFilterOpen, setMembersFilterOpen] = useState(false);

  const memberStats = MOCK_MEMBER_STATS[period];
  const dailyStats = MOCK_DAILY_STATS[period];

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return memberStats
      .filter((row) => {
        const matchesMember = selectedMemberIds.includes(row.memberId);
        const matchesQuery = !query || row.name.toLowerCase().includes(query);
        return matchesMember && matchesQuery;
      })
      .sort((a, b) => (sortOrder === "most" ? b.percent - a.percent : a.percent - b.percent));
  }, [memberStats, selectedMemberIds, search, sortOrder]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title="Статистика сотрудников" />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {MOCK_PERIOD_RANGES[period]}
      </p>

      <CusSegment
        value={tab}
        onValueChange={(v) => setTab(v as StatsMainTab)}
        items={[
          { id: "general", label: "Общее" },
          { id: "byDay", label: "По дням" },
        ]}
      />

      <PeriodTabs value={period} onChange={setPeriod} />

      {tab === "general" ? (
        <>
          <StatsFilterRow
            value={search}
            onValueChange={setSearch}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onOpenMembersFilter={() => setMembersFilterOpen(true)}
          />

          {filteredRows.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {filteredRows.map((row) => (
                <MemberStatCard key={row.memberId} row={row} />
              ))}
            </div>
          )}

          <MemberPickerDrawer
            open={isMembersFilterOpen}
            onClose={() => setMembersFilterOpen(false)}
            members={MOCK_STATS_MEMBERS}
            selectedIds={selectedMemberIds}
            onApply={setSelectedMemberIds}
          />
        </>
      ) : (
        <DailyStatsList rows={dailyStats} />
      )}
    </div>
  );
}
