import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { todayApiDate } from "@/utils/apiDate";
import { CompletionRateCard } from "./components/CompletionRateCard";
import { PeriodChartCard } from "./components/PeriodChartCard";
import { PriorityCard } from "./components/PriorityCard";
import { ProjectsBreakdownCard } from "./components/ProjectsBreakdownCard";
import { StatsPeriodTabs } from "./components/StatsPeriodTabs";
import { useMyStatistics } from "./hooks/useApiStatistics";
import {
  CHART_TITLE_KEYS,
  toChartBars,
  toCompletion,
  toPriorities,
  toProjects,
  toRangeLabel,
} from "./lib/mapStatistics";
import type { StatsPeriod } from "./types";

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
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="font-condensed text-3xl font-semibold leading-none text-primary">
          {t("statistics.title")}
        </h1>
        <p className="mt-1.5 h-5 text-sm font-semibold text-brand">
          {stats ? toRangeLabel(stats) : ""}
        </p>
      </div>

      <StatsPeriodTabs value={period} onChange={setPeriod} />

      {statsQuery.isError ? (
        <p className="px-1 text-sm text-error-strong">{t("statistics.loadError")}</p>
      ) : !stats ? (
        <>
          <CardSkeleton height={148} />
          <CardSkeleton height={220} />
          <CardSkeleton height={120} />
        </>
      ) : (
        <>
          <CompletionRateCard summary={toCompletion(stats)} />
          <PeriodChartCard title={t(CHART_TITLE_KEYS[period])} bars={toChartBars(stats, period)} />
          <ProjectsBreakdownCard projects={toProjects(stats)} />
          <PriorityCard items={toPriorities(stats)} />
        </>
      )}
    </div>
  );
}
