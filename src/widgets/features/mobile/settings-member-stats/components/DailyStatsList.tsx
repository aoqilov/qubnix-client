import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import type { DailyStatsRow } from "../types";

interface DailyStatsListProps {
  rows: DailyStatsRow[];
}

export function DailyStatsList({ rows }: DailyStatsListProps) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <CusCardbox key={row.date} className="flex flex-col gap-2 rounded-card bg-surface p-3">
          <span className="text-sm font-semibold text-primary">{row.date}</span>
          <div className="grid grid-cols-4 gap-1 text-center text-xs font-semibold">
            <span style={{ color: "var(--brand-default)" }}>{row.done} сдано</span>
            <span style={{ color: "var(--status-success-text)" }}>{row.completed} сделано</span>
            <span style={{ color: "var(--status-progress-text)" }}>{row.inProgress} в проц.</span>
            <span style={{ color: "var(--status-error-text)" }}>{row.overdue} просроч.</span>
          </div>
        </CusCardbox>
      ))}
    </div>
  );
}
