import { Link } from "react-router-dom";
import type { Task } from "@/types/task.types";

export function TaskListItem({ task }: { task: Task }) {
  return (
    <Link
      to={`/tasks/${task.id}`}
      className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-second)] px-4 py-3"
    >
      <span className="text-sm">{task.title}</span>
      <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{task.status}</span>
    </Link>
  );
}
