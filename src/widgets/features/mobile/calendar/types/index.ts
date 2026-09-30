export type { WeekDayCell as CalendarDayCell } from "@/utils/weekDays";
export type { DayTaskStats } from "@/utils/calendarDay";

export interface CalendarProjectSummary {
  id: string;
  name: string;
  initials: string;
  done: number;
  total: number;
  isOverdue?: boolean;
}
