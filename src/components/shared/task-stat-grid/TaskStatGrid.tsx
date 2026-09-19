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
}

function TaskStatGrid({ done, completed, inProgress, overdue }: TaskStatGridProps) {
  return (
    <div className="grid grid-cols-4 divide-x divide-subtle">
      <StatCell value={done} label="Сдано" color="var(--brand-default)" />
      <StatCell value={completed} label="Сделано" color="var(--status-success-text)" />
      <StatCell value={inProgress} label="В процессе" color="var(--status-progress-text)" />
      <StatCell value={overdue} label="Просрочено" color="var(--status-error-text)" />
    </div>
  );
}

export default TaskStatGrid;
