import { Link } from "react-router-dom";
import type { Task } from "@/types/task.types";

export function TaskListItem({ task }: { task: Task }) {
  return (
    <Link
      to={`/tasks/${task.id}`}
      className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3"
    >
      <span className="text-sm">{task.title}</span>
      <span className="text-xs uppercase tracking-wide text-neutral-500">{task.status}</span>
    </Link>
  );
}
