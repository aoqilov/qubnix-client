import { useTranslation } from "react-i18next";

interface StatCellProps {
  value: number;
  label: string;
  color: string;
}

function StatCell({ value, label, color }: StatCellProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-1">
      <span className="text-lg font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wide text-secondary">
        {label}
      </span>
    </div>
  );
}

interface TaskStatGridProps {
  done: number;
  completed: number;
  inProgress: number;
  overdue: number;
  /** 2-katak yorlig'i — default tasks.stats.completed. /statistics'da u yerda `todo` turadi. */
  completedLabel?: string;
}

function TaskStatGrid({
  done,
  completed,
  inProgress,
  overdue,
  completedLabel,
}: TaskStatGridProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 divide-x divide-subtle">
      <StatCell value={done} label={t("tasks.stats.done")} color="var(--brand-default)" />
      <StatCell value={completed} label={completedLabel ?? t("tasks.stats.completed")} color="var(--status-success-text)" />
      <StatCell value={inProgress} label={t("tasks.stats.inProgress")} color="var(--status-progress-text)" />
      <StatCell value={overdue} label={t("tasks.stats.overdue")} color="var(--status-error-text)" />
    </div>
  );
}

export default TaskStatGrid;
