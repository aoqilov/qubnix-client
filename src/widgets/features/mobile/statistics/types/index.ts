export type StatsPeriod = "week" | "month";

export interface CompletionSummary {
  percent: number;
  taskCount: number;
  done: number;
  /** Hali boshlanmagan (`todo`) — gridda "Назначено". */
  assigned: number;
  inProgress: number;
  overdue: number;
}

export interface StatBarChartItem {
  label: string;
  done: number;
  notDone: number;
  /** Shu kun/haftadagi barcha vazifalar (todo + in_progress + done + not_done). */
  total: number;
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
