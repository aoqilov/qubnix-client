import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import TaskStatGrid from "@/components/shared/task-stat-grid/TaskStatGrid";
import { avatarColorVar } from "@/utils/avatarColor";
import type { MemberStatsRow } from "../types";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

interface MemberStatCardProps {
  row: MemberStatsRow;
}

export function MemberStatCard({ row }: MemberStatCardProps) {
  const accent = avatarColorVar(row.memberId);

  return (
    <CusCardbox className="flex flex-col gap-4 rounded-card bg-surface p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 flex-none items-center justify-center rounded-avatar text-sm font-semibold text-on-brand"
          style={{ background: accent }}
        >
          {initialsOf(row.name)}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">
          {row.name}
        </span>
        <span className="flex items-center gap-1 text-lg font-bold text-brand">
          {row.percent}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${row.percent}%` }}
        />
      </div>

      <TaskStatGrid
        done={row.done}
        completed={row.assigned}
        completedLabel="Назначено"
        inProgress={row.inProgress}
        overdue={row.overdue}
      />
    </CusCardbox>
  );
}
