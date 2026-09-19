import type { StatsPeriod } from "../types";

const ITEMS: { id: StatsPeriod; label: string }[] = [
  { id: "7", label: "7 дней" },
  { id: "15", label: "15 дней" },
  { id: "30", label: "30 дней" },
];

interface PeriodTabsProps {
  value: StatsPeriod;
  onChange: (value: StatsPeriod) => void;
}

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div className="flex items-center gap-4">
      {ITEMS.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={
              isActive
                ? "border-b-2 border-brand pb-1 text-sm font-semibold text-brand"
                : "border-b-2 border-transparent pb-1 text-sm font-medium text-secondary"
            }
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
