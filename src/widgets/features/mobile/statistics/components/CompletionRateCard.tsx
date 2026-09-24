import { useTranslation } from "react-i18next";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import TaskStatGrid from "@/components/shared/task-stat-grid/TaskStatGrid";
import { tasksLabel } from "@/utils/countLabels";
import type { CompletionSummary } from "../types";

interface CompletionRateCardProps {
  summary: CompletionSummary;
}

export function CompletionRateCard({ summary }: CompletionRateCardProps) {
  const { t } = useTranslation();
  return (
    <CusCardbox
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex flex-col gap-3 rounded-card bg-surface"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-secondary">{t("statistics.completion.title")}</span>
        <span className="font-condensed text-3xl font-bold leading-none text-brand">{summary.percent}%</span>
      </div>

      <span className="text-sm text-secondary">{tasksLabel(summary.taskCount)}</span>

      <TaskStatGrid
        done={summary.done}
        completed={summary.assigned}
        completedLabel={t("common.taskStatus.todo")}
        inProgress={summary.inProgress}
        overdue={summary.overdue}
      />
    </CusCardbox>
  );
}
