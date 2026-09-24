import { useTranslation } from "react-i18next";
import type { StatsPeriod } from "../types";

const ITEMS: StatsPeriod[] = ["week", "month"];

interface StatsPeriodTabsProps {
  value: StatsPeriod;
  onChange: (value: StatsPeriod) => void;
}

export function StatsPeriodTabs({ value, onChange }: StatsPeriodTabsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      {ITEMS.map((id) => {
        const item = { id, label: t(`statistics.period.${id}`) };
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
