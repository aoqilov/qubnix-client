export type StatsMainTab = "general" | "byDay";

export type StatsPeriod = "7" | "15" | "30";

export interface MemberStatsRow {
  memberId: string;
  name: string;
  done: number;
  completed: number;
  inProgress: number;
  overdue: number;
  percent: number;
}

export interface DailyStatsRow {
  date: string;
  done: number;
  completed: number;
  inProgress: number;
  overdue: number;
}
