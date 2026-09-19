import type { CalendarDayCell } from "../types";

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Shu sana joylashgan haftaning dushanbasi (haftalar dushanbadan boshlanadi). */
export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function formatMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" })
    .format(date)
    .toUpperCase();
}

export function buildWeekDays(weekStart: Date, selectedDate: Date, eventDates: Set<string>): CalendarDayCell[] {
  const selectedKey = toDateKey(selectedDate);

  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(weekStart, index);
    const dayOfWeek = current.getDay();
    const weekdayLabel = new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(current).toUpperCase();

    return {
      date: current,
      dayNumber: current.getDate(),
      weekdayLabel,
      isSelected: toDateKey(current) === selectedKey,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      hasEvent: eventDates.has(toDateKey(current)),
    };
  });
}
