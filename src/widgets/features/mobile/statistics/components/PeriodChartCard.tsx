import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { StatBarChart } from "./StatBarChart";
import type { StatBarChartItem } from "../types";

interface PeriodChartCardProps {
  title: string;
  bars: StatBarChartItem[];
}

export function PeriodChartCard({ title, bars }: PeriodChartCardProps) {
  return (
    <CusCardbox
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex flex-col gap-4 rounded-card bg-surface"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{title}</span>
      <StatBarChart data={bars} />
    </CusCardbox>
  );
}
