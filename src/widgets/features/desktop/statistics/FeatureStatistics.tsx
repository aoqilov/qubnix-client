import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { useWorkspaceStore } from "@/store/workspace.store";
import { todayApiDate } from "@/utils/apiDate";
// Hook, mapper va kartalar platformaga bog'liq emas — mobil bilan umumiy.
import { CompletionRateCard } from "@/widgets/features/mobile/statistics/components/CompletionRateCard";
import { PeriodChartCard } from "@/widgets/features/mobile/statistics/components/PeriodChartCard";
import { PriorityCard } from "@/widgets/features/mobile/statistics/components/PriorityCard";
import { ProjectsBreakdownCard } from "@/widgets/features/mobile/statistics/components/ProjectsBreakdownCard";
import { StatsPeriodTabs } from "@/widgets/features/mobile/statistics/components/StatsPeriodTabs";
import { useMyStatistics } from "@/widgets/features/mobile/statistics/hooks/useApiStatistics";
import {
  CHART_TITLE_KEYS,
  toChartBars,
  toCompletion,
  toPriorities,
  toProjects,
  toRangeLabel,
} from "@/widgets/features/mobile/statistics/lib/mapStatistics";
import type { StatsPeriod } from "@/widgets/features/mobile/statistics/types";

function CardSkeleton({ height }: { height: number }) {
  return (
    <div className="animate-pulse rounded-card border border-subtle bg-surface" style={{ height }} />
  );
}

export default function FeatureStatistics() {
  const { t } = useTranslation();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const [period, setPeriod] = useState<StatsPeriod>("week");
  const statsQuery = useMyStatistics(
    organizationId,
    period === "week" ? "weekly" : "monthly",
    todayApiDate(),
  );
  const stats = statsQuery.data;

  return (
    <div className="flex flex-col gap-5">
      <CusPageTitle
        className=""
        title={t("statistics.title")}
        subtitle={stats ? toRangeLabel(stats) : ""}
      />

      <StatsPeriodTabs value={period} onChange={setPeriod} />

      {statsQuery.isError ? (
        <p className="text-sm text-error-strong">{t("statistics.loadError")}</p>
      ) : !stats ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-4">
            <CardSkeleton height={148} />
            <CardSkeleton height={260} />
          </div>
          <div className="flex flex-col gap-4">
            <CardSkeleton height={120} />
            <CardSkeleton height={120} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-4">
            <CompletionRateCard summary={toCompletion(stats)} />
            <PeriodChartCard title={t(CHART_TITLE_KEYS[period])} bars={toChartBars(stats, period)} />
          </div>
          <div className="flex flex-col gap-4">
            <ProjectsBreakdownCard projects={toProjects(stats)} />
            <PriorityCard items={toPriorities(stats)} />
          </div>
        </div>
      )}
    </div>
  );
}
