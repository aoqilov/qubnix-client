import type { RoutineFilter } from "../types";

const ITEMS: { id: RoutineFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "daily", label: "Дни" },
  { id: "weekly", label: "Неделя" },
  { id: "monthly", label: "Месяц" },
  { id: "yearly", label: "Год" },
];

interface RoutineFrequencyTabsProps {
  value: RoutineFilter;
  onChange: (value: RoutineFilter) => void;
}

export function RoutineFrequencyTabs({ value, onChange }: RoutineFrequencyTabsProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {ITEMS.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={
              isActive
                ? "flex-none border-b-2 border-brand pb-1 text-sm font-semibold text-brand"
                : "flex-none border-b-2 border-transparent pb-1 text-sm font-medium text-secondary"
            }
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
