import { useTranslation } from "react-i18next";
import { Fragment } from "react";

interface StatCellProps {
  value: number;
  label: string;
  color: string;
}

function StatCell({ value, label, color }: StatCellProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5">
      <span className="text-lg font-bold" style={{ color }}>
        {value}
      </span>
      {/* Tor ekranda uzun yorliq ("В ПРОЦЕССЕ", "MUDDATI O'TGAN") 2 qatorga o'tadi — markazda qoladi, katakdan chiqmaydi. */}
      <span className="w-full break-words text-center text-[10px] font-medium uppercase leading-tight text-secondary">
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
  const cells: StatCellProps[] = [
    { value: done, label: t("tasks.stats.done"), color: "var(--brand-default)" },
    { value: completed, label: completedLabel ?? t("tasks.stats.completed"), color: "var(--status-success-text)" },
    { value: inProgress, label: t("tasks.stats.inProgress"), color: "var(--status-progress-text)" },
    { value: overdue, label: t("tasks.stats.overdue"), color: "var(--status-error-text)" },
  ];

  // space-between: chetki kataklar karta chetiga yopishadi; ajratgich ham alohida element,
  // shuning uchun u kataklar orasidagi bo'shliqning o'rtasida turadi.
  return (
    <div className="flex items-stretch justify-between gap-2">
      {cells.map((cell, i) => (
        <Fragment key={i}>
          {i > 0 && <span aria-hidden className="border-l border-subtle" />}
          <StatCell {...cell} />
        </Fragment>
      ))}
    </div>
  );
}

export default TaskStatGrid;
