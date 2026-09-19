export interface CalendarDayCell {
  date: Date;
  dayNumber: number;
  weekdayLabel: string;
  isSelected?: boolean;
  isWeekend?: boolean;
  hasEvent?: boolean;
}
