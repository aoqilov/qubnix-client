export type { WeekDayCell as CalendarDayCell } from "@/utils/weekDays";

export interface DayTaskStats {
  total: number;
  done: number;
  overdue: number;
  left: number;
}

export interface CalendarProjectSummary {
  id: string;
  name: string;
  initials: string;
  done: number;
  total: number;
  isOverdue?: boolean;
}
