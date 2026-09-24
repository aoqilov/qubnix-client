export type StatsMainTab = "general" | "byDay";

export type StatsPeriod = "7" | "15" | "30";

export interface MemberStatsRow {
  memberId: string;
  name: string;
  done: number;
  /** Hali boshlanmagan (`todo`) — gridda "Назначено". */
  assigned: number;
  inProgress: number;
  overdue: number;
  percent: number;
}

