export type StatsPeriod = "week" | "month" | "year";

export interface CompletionSummary {
  percent: number;
  taskCount: number;
  trendDelta: number;
  done: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface StatBarChartItem {
  label: string;
  done: number;
  notDone: number;
  muted?: boolean;
}

export interface ProjectStat {
  id: string;
  name: string;
  done: number;
  total: number;
}

export interface StreakSummary {
  current: number;
  windowDays: number;
  activeDays: boolean[];
}

export type PriorityLevel = "high" | "medium" | "low";

export interface PriorityStat {
  level: PriorityLevel;
  count: number;
}
