import type { CalendarProjectSummary, DayTaskStats } from "../types";
import { addDays, toDateKey } from "./calendarWeek";

const today = new Date();

/** Kelajakda vazifalar/eventlar API'sidan keladi — hozircha joriy haftaga yaqin 2 ta sana mock qilingan. */
export const MOCK_EVENT_DATES = new Set<string>([toDateKey(addDays(today, 3)), toDateKey(addDays(today, -2))]);

/** Kelajakda tanlangan kun bo'yicha vazifalar API'sidan keladi — hozircha sana asosida psevdo-tasodifiy statistika. */
export function getMockDayStats(date: Date): DayTaskStats {
  const seed = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const total = 1 + (seed % 4);
  const done = seed % (total + 1);
  const overdue = Math.floor(seed / 7) % (total - done + 1);
  const left = total - done - overdue;
  return { total, done, overdue, left };
}

const MOCK_PROJECT_POOL: Array<Pick<CalendarProjectSummary, "id" | "name" | "initials">> = [
  { id: "redesign", name: "Редизайн", initials: "RE" },
  { id: "client", name: "Клиент", initials: "КЛ" },
  { id: "marketing", name: "Маркетинг", initials: "МА" },
];

/** Kelajakda tanlangan kun bo'yicha loyihalar API'sidan keladi — hozircha sana asosida psevdo-tasodifiy statistika. */
export function getMockDayProjects(date: Date): CalendarProjectSummary[] {
  const seed = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const count = 1 + (seed % MOCK_PROJECT_POOL.length);

  return MOCK_PROJECT_POOL.slice(0, count).map((project, index) => {
    const projectSeed = seed + index * 17;
    const total = 1 + (projectSeed % 3);
    const isOverdue = projectSeed % 5 === 0;
    const done = isOverdue ? 0 : projectSeed % (total + 1);
    return { ...project, done, total, isOverdue };
  });
}
