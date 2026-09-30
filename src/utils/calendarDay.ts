import type { TaskStatusTotals } from "@/api/tasks/tasks.types";

export interface DayTaskStats {
  total: number;
  done: number;
  overdue: number;
  left: number;
}

export function toDayStats(t: TaskStatusTotals): DayTaskStats {
  return { total: t.total, done: t.done, overdue: t.not_done, left: t.todo + t.in_progress };
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}
