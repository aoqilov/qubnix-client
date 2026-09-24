import type { RawTaskRoutine } from "@/api/task-routines/task-routines.types";
import { MONTH_NOMINATIVE, WEEKDAY_SHORT } from "./routineSchedule";

/** Routine kartasidagi "Har kuni 09:00" / "Har hafta Dush, Chor 10:00" kabi qator. */
export function formatRepeatLabel(routine: RawTaskRoutine): string {
  const time = routine.time_of_day;
  switch (routine.frequency) {
    case "daily":
      return `Har kuni ${time}`;
    case "weekly": {
      const days = routine.weekdays.map((d) => WEEKDAY_SHORT[d] ?? d).join(", ");
      return `Har hafta ${days || "-"} ${time}`;
    }
    case "monthly": {
      const days = routine.month_days.join(", ");
      return `Har oy, ${days || "-"}-sana ${time}`;
    }
    case "yearly": {
      const [, month, day] = routine.start_date.split("-").map(Number);
      const monthName = MONTH_NOMINATIVE[(month ?? 1) - 1] ?? "";
      return `Har yil, ${day} ${monthName} ${time}`;
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

/** "Keyingisi: DD.MM.YYYY HH:mm" — `next_run_at` dan. */
export function formatNextRunLabel(routine: RawTaskRoutine): string {
  return `Keyingisi: ${formatDateTime(routine.next_run_at)}`;
}
