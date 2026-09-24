import i18n from "@/i18n";
import type { RawTaskRoutine } from "@/api/task-routines/task-routines.types";
import { dayMonthLabel, weekdayShortLabel } from "./routineSchedule";

/**
 * Routine kartasidagi "Каждый день 09:00" / "Har hafta Du, Chor 10:00" kabi qator.
 * Render paytida chaqiriladi — chaqiruvchi `useTranslation` ishlatgani uchun til
 * almashganda qayta hisoblanadi.
 */
export function formatRepeatLabel(routine: RawTaskRoutine): string {
  const time = routine.time_of_day;
  switch (routine.frequency) {
    case "daily":
      return i18n.t("routines.repeat.daily", { time });
    case "weekly": {
      const days = routine.weekdays.map(weekdayShortLabel).join(", ");
      return i18n.t("routines.repeat.weekly", { days: days || "-", time });
    }
    case "monthly": {
      const days = routine.month_days.join(", ");
      return i18n.t("routines.repeat.monthly", { days: days || "-", time });
    }
    case "yearly": {
      const [, month, day] = routine.start_date.split("-").map(Number);
      return i18n.t("routines.repeat.yearly", { date: dayMonthLabel(month ?? 1, day ?? 1), time });
    }
    default:
      return time;
  }
}

/** ISO sana-vaqtni "DD.MM.YYYY HH:mm" ko'rinishiga keltiradi. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${d.getFullYear()} ${hh}:${mm}`;
}

/** "YYYY-MM-DD" ni "DD.MM.YYYY" ko'rinishiga keltiradi. */
export function formatApiDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

/** "Следующий запуск: DD.MM.YYYY HH:mm" — `next_run_at` dan. */
export function formatNextRunLabel(routine: RawTaskRoutine): string {
  return i18n.t("routines.nextRun", { date: formatDateTime(routine.next_run_at) });
}
