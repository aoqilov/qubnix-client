import i18n from "@/i18n";
import type { RawTask } from "@/api/tasks/tasks.types";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDayMonth(d: Date): string {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}`;
}

export function formatTime(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Muddat — "04.10 00:00"; muddat yo'q bo'lsa "Без срока". */
export function formatDueLabel(task: RawTask): string {
  if (!task.due_at) return i18n.t("tasks.card.noDeadline");
  const due = new Date(task.due_at);
  return `${formatDayMonth(due)} ${formatTime(due)}`;
}

/**
 * Diapazonli vazifaning boshlanishi (start_at bor va due_at'dan oldin).
 * Bir kun ichida — "09:00", bir necha kunga — "28.09 09:00". Diapazon bo'lmasa undefined.
 */
export function formatStartLabel(task: RawTask): string | undefined {
  if (!task.start_at || !task.due_at) return undefined;
  const start = new Date(task.start_at);
  const due = new Date(task.due_at);
  if (start.getTime() >= due.getTime()) return undefined;
  if (start.toDateString() === due.toDateString()) return formatTime(start);
  return `${formatDayMonth(start)} ${formatTime(start)}`;
}

/** Muddati o'tgan va bajarilmagan. */
export function isTaskOverdue(task: RawTask): boolean {
  return task.status !== "done" && !!task.due_at && new Date(task.due_at) < new Date();
}
