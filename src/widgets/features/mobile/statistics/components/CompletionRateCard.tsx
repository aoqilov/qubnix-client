import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import TaskStatGrid from "@/components/shared/task-stat-grid/TaskStatGrid";
import { tasksLabel } from "@/utils/pluralRu";
import type { CompletionSummary } from "../types";

interface CompletionRateCardProps {
  summary: CompletionSummary;
}

export function CompletionRateCard({ summary }: CompletionRateCardProps) {
  const isPositive = summary.trendDelta >= 0;

  return (
    <CusCardbox
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex flex-col gap-3 rounded-card bg-surface"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-secondary">Процент выполнения</span>
        <span className="font-condensed text-3xl font-bold leading-none text-brand">{summary.percent}%</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary">{tasksLabel(summary.taskCount)}</span>
        <CusBadge
          tone={isPositive ? "success" : "error"}
          size="xs"
          leftIcon={isPositive ? <LuTrendingUp size={12} /> : <LuTrendingDown size={12} />}
        >
          {isPositive ? "+" : ""}
          {summary.trendDelta}%
        </CusBadge>
      </div>

      <TaskStatGrid
        done={summary.done}
        completed={summary.completed}
        inProgress={summary.inProgress}
        overdue={summary.overdue}
      />
    </CusCardbox>
  );
}
