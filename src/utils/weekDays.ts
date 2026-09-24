import { currentIntlLocale } from "@/i18n/useIntlLocale";

/** Haftalik lentadagi bitta kun katakchasi — kalendar va xodimlar statistikasi uchun umumiy. */
export interface WeekDayCell {
  date: Date;
  dayNumber: number;
  weekdayLabel: string;
  isSelected?: boolean;
  isToday?: boolean;
  isWeekend?: boolean;
  isPast?: boolean;
}

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
  return new Intl.DateTimeFormat(currentIntlLocale(), { month: "long", year: "numeric" })
    .format(date)
    .toUpperCase();
}

export function buildWeekDays(weekStart: Date, selectedDate: Date): WeekDayCell[] {
  const selectedKey = toDateKey(selectedDate);
  const todayKey = toDateKey(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(weekStart, index);
    const dayOfWeek = current.getDay();
    const weekdayLabel = new Intl.DateTimeFormat(currentIntlLocale(), { weekday: "short" })
      .format(current)
      .toUpperCase();

    return {
      date: current,
      dayNumber: current.getDate(),
      weekdayLabel,
      isSelected: toDateKey(current) === selectedKey,
      isToday: toDateKey(current) === todayKey,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isPast: toDateKey(current) < todayKey,
    };
  });
}
