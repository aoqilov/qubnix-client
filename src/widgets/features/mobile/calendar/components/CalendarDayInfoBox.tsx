import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { getMockDayStats } from "../lib/mockCalendar";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface CalendarDayInfoBoxProps {
  date: Date;
}

export function CalendarDayInfoBox({ date }: CalendarDayInfoBoxProps) {
  const stats = getMockDayStats(date);
  const monthLabel = capitalize(new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(date));
  const weekdayLabel = new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(date).toUpperCase();
  const donePercent = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

  return (
    <CusCardbox className="flex flex-col gap-4 rounded-card bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-condensed text-3xl font-semibold leading-none text-primary">
            {String(date.getDate()).padStart(2, "0")}
          </p>
          <p className="mt-1.5 text-sm text-secondary">
            {monthLabel} · {weekdayLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="font-condensed text-3xl font-semibold leading-none text-brand">{stats.total}</p>
          <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">Задачи</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
        <span className="text-success-strong">Сдано — {stats.done}</span>
        <span className="text-error-strong">Просрочено — {stats.overdue}</span>
        <span className="text-secondary">Осталось — {stats.left}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div className="h-full rounded-full bg-brand" style={{ width: `${donePercent}%` }} />
      </div>
    </CusCardbox>
  );
}
