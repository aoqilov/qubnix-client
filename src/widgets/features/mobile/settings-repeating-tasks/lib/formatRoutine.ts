import type { RawTaskRoutine } from "@/api/task-routines/task-routines.types";

const WEEKDAY_SHORT: Record<number, string> = {
  1: "Dush",
  2: "Sesh",
  3: "Chor",
  4: "Pay",
  5: "Jum",
  6: "Shan",
  7: "Yak",
};

const MONTH_NOMINATIVE = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

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

/** "Keyingisi: DD.MM.YYYY HH:mm" — `next_run_at` dan. */
export function formatNextRunLabel(routine: RawTaskRoutine): string {
  const d = new Date(routine.next_run_at);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `Keyingisi: ${day}.${month}.${d.getFullYear()} ${hh}:${mm}`;
}
