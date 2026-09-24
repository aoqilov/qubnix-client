export interface CalendarDayCell {
  date: Date;
  dayNumber: number;
  weekdayLabel: string;
  isSelected?: boolean;
  isToday?: boolean;
  isWeekend?: boolean;
  isPast?: boolean;
}

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
