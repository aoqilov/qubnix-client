import { useState } from "react";
import { CompletionRateCard } from "./components/CompletionRateCard";
import { PeriodChartCard } from "./components/PeriodChartCard";
import { PriorityCard } from "./components/PriorityCard";
import { ProjectsBreakdownCard } from "./components/ProjectsBreakdownCard";
import { StatsPeriodTabs } from "./components/StatsPeriodTabs";
import {
  CHART_TITLES,
  MOCK_CHART_BUCKETS,
  MOCK_COMPLETION,
  MOCK_PERIOD_RANGES,
  MOCK_PRIORITY,
  MOCK_PROJECTS,
} from "./lib/mockStatistics";
import type { StatsPeriod } from "./types";

export default function FeatureStatistics() {
  const [period, setPeriod] = useState<StatsPeriod>("week");

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="font-condensed text-3xl font-semibold leading-none text-primary">
          Статистика
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-brand">
          {MOCK_PERIOD_RANGES[period]}
        </p>
      </div>

      <StatsPeriodTabs value={period} onChange={setPeriod} />

      <CompletionRateCard summary={MOCK_COMPLETION[period]} />
      <PeriodChartCard
        title={CHART_TITLES[period]}
        bars={MOCK_CHART_BUCKETS[period]}
      />
      <ProjectsBreakdownCard projects={MOCK_PROJECTS[period]} />
      <PriorityCard items={MOCK_PRIORITY[period]} />
    </div>
  );
}
