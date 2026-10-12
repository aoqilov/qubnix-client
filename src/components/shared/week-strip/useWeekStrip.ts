import { useMemo, useState } from "react";
import { addDays, buildWeekDays, getWeekStart, toDateKey } from "@/utils/weekDays";

/**
 * `WeekStrip` uchun hafta holati: ko'rinayotgan hafta, animatsiya yo'nalishi va kunlar.
 * Tanlangan kun ota komponentda saqlanadi — hook faqat qaysi hafta ko'rsatilishini biladi.
 */
export function useWeekStrip(selectedDate: Date) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(selectedDate));
  const [direction, setDirection] = useState(0);

  const selectedKey = toDateKey(selectedDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `selectedDate` kalit orqali kuzatiladi
  const days = useMemo(() => buildWeekDays(weekStart, selectedDate), [weekStart, selectedKey]);

  function shiftWeek(offsetDays: number) {
    setDirection(offsetDays > 0 ? 1 : -1);
    setWeekStart((prev) => addDays(prev, offsetDays));
  }

  /** Berilgan sana joylashgan haftaga o'tadi (yo'nalish animatsiyasi bilan). */
  function showWeekOf(date: Date) {
    const next = getWeekStart(date);
    setDirection(next.getTime() === weekStart.getTime() ? 0 : next.getTime() > weekStart.getTime() ? 1 : -1);
    setWeekStart(next);
  }

  return { days, direction, weekStart, shiftWeek, showWeekOf };
}
