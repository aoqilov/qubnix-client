import { LuFlag } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { scaleToPercent } from "../lib/statsScale";
import type { PriorityLevel, PriorityStat } from "../types";

const PRIORITY_META: Record<PriorityLevel, { label: string; color: string }> = {
  high: { label: "Высокий", color: "var(--status-error-text)" },
  medium: { label: "Средний", color: "var(--status-warning-text)" },
  low: { label: "Низкий", color: "var(--text-secondary)" },
};

function PriorityRow({ item, max }: { item: PriorityStat; max: number }) {
  const meta = PRIORITY_META[item.level];
  const percent = scaleToPercent(item.count, max, 4);

  return (
    <div className="flex items-center gap-3">
      <LuFlag size={16} style={{ color: meta.color }} className="flex-none" />
      <span className="w-16 flex-none text-sm font-medium text-primary">{meta.label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: meta.color }} />
      </div>
      <span className="w-5 flex-none text-right text-sm font-semibold text-primary">{item.count}</span>
    </div>
  );
}

interface PriorityCardProps {
  items: PriorityStat[];
}

export function PriorityCard({ items }: PriorityCardProps) {
  const max = Math.max(...items.map((item) => item.count));

  return (
    <CusCardbox
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex flex-col gap-4 rounded-card bg-surface"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Приоритет</span>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <PriorityRow key={item.level} item={item} max={max} />
        ))}
      </div>
    </CusCardbox>
  );
}
