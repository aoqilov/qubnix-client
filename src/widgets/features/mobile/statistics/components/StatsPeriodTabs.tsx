import type { StatsPeriod } from "../types";

const ITEMS: { id: StatsPeriod; label: string }[] = [
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
];

interface StatsPeriodTabsProps {
  value: StatsPeriod;
  onChange: (value: StatsPeriod) => void;
}

export function StatsPeriodTabs({ value, onChange }: StatsPeriodTabsProps) {
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
