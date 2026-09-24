import type { TaskPriority, TaskStatistics } from "@/api/tasks/tasks.types";
import { fromApiDate } from "@/utils/apiDate";
import type {
  CompletionSummary,
  PriorityStat,
  ProjectStat,
  StatBarChartItem,
  StatsPeriod,
} from "../types";

export const CHART_TITLES: Record<StatsPeriod, string> = {
  week: "ПО ДНЯМ НЕДЕЛИ",
  month: "ПО НЕДЕЛЯМ МЕСЯЦА",
};

const PRIORITY_ORDER: TaskPriority[] = ["high", "medium", "low"];

function formatDayMonth(apiDate: string): string {
  const [, m, d] = apiDate.split("-");
  return `${d}.${m}`;
}

/** "31.08 – 06.09.2026" — timeline'ning birinchi va oxirgi chegarasidan. */
export function toRangeLabel(stats: TaskStatistics): string {
  const first = stats.timeline[0];
  const last = stats.timeline[stats.timeline.length - 1];
  if (!first || !last) return "";
  return `${formatDayMonth(first.start_date)} – ${formatDayMonth(last.end_date)}.${last.end_date.slice(0, 4)}`;
}

export function toCompletion(stats: TaskStatistics): CompletionSummary {
  const t = stats.totals;
  return {
    percent: t.total > 0 ? Math.round((t.done / t.total) * 100) : 0,
    taskCount: t.total,
    done: t.done,
    assigned: t.todo,
    inProgress: t.in_progress,
    overdue: t.not_done,
  };
}

/** weekly → kun nomlari ("ПН"), monthly → "1 нед.", "2 нед.", ... */
export function toChartBars(stats: TaskStatistics, period: StatsPeriod): StatBarChartItem[] {
  return stats.timeline.map((bucket, index) => ({
    label:
      period === "week"
        ? new Intl.DateTimeFormat("ru-RU", { weekday: "short" })
            .format(fromApiDate(bucket.start_date))
            .toUpperCase()
        : `${index + 1} нед.`,
    done: bucket.totals.done,
    notDone: bucket.totals.not_done,
    total: bucket.totals.total,
  }));
}

export function toProjects(stats: TaskStatistics): ProjectStat[] {
  return stats.projects
    .filter((p) => p.totals.total > 0)
    .map((p) => ({ id: String(p.id), name: p.name, done: p.totals.done, total: p.totals.total }));
}

export function toPriorities(stats: TaskStatistics): PriorityStat[] {
  return PRIORITY_ORDER.map((level) => ({
    level,
    count: stats.priorities.find((p) => p.priority === level)?.totals.total ?? 0,
  }));
}
