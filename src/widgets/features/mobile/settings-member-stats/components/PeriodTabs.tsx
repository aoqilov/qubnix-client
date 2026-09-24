import { useTranslation } from "react-i18next";
import { daysLabel } from "@/utils/countLabels";
import type { StatsPeriod } from "../types";

const ITEMS: StatsPeriod[] = ["7", "15", "30"];

interface PeriodTabsProps {
  value: StatsPeriod;
  onChange: (value: StatsPeriod) => void;
}

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  useTranslation(); // til almashsa "7 дней" / "7 kun" qayta hisoblanadi
  return (
    <div className="flex items-center gap-4">
      {ITEMS.map((id) => {
        const item = { id, label: daysLabel(Number(id)) };
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
