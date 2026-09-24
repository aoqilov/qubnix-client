import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { getDayKind, type DayKind } from "@/utils/apiDate";
import type { DayTaskStats } from "../types";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const DAY_KIND_LABEL: Record<DayKind, { label: string; className: string }> = {
  past: { label: "Прошедший день", className: "bg-surface-secondary text-secondary" },
  today: { label: "Сегодня", className: "bg-brand-subtle text-brand" },
  future: { label: "Запланировано", className: "bg-info-soft text-info-strong" },
};

interface CalendarDayInfoBoxProps {
  date: Date;
  stats: DayTaskStats;
}

export function CalendarDayInfoBox({ date, stats }: CalendarDayInfoBoxProps) {
  const kind = getDayKind(date);
  const monthLabel = capitalize(new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(date));
  const weekdayLabel = new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(date).toUpperCase();
  const donePercent = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;
  // O'tgan kunda "qolgan" vazifa bo'lmaydi — yopilmagan hammasi bajarilmagan hisoblanadi.
  const notDone = stats.overdue + stats.left;
  const notDonePercent = stats.total > 0 ? (notDone / stats.total) * 100 : 0;

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
          <span
            className={`mt-2 inline-block rounded-chip px-2 py-0.5 text-[11px] font-semibold ${DAY_KIND_LABEL[kind].className}`}
          >
            {DAY_KIND_LABEL[kind].label}
          </span>
        </div>
        <div className="text-right">
          <p className="font-condensed text-3xl font-semibold leading-none text-brand">{stats.total}</p>
          <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">Задачи</p>
        </div>
      </div>

      {kind === "past" && (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
            <span className="text-success-strong">Сдано — {stats.done}</span>
            <span className="text-error-strong">Не выполнено — {notDone}</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
            <div className="h-full bg-success" style={{ width: `${donePercent}%` }} />
            <div className="h-full bg-error" style={{ width: `${notDonePercent}%` }} />
          </div>
        </>
      )}

      {kind === "today" && (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
            <span className="text-success-strong">Сдано — {stats.done}</span>
            <span className="text-error-strong">Просрочено — {stats.overdue}</span>
            <span className="text-secondary">Осталось — {stats.left}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
            <div className="h-full rounded-full bg-brand" style={{ width: `${donePercent}%` }} />
          </div>
        </>
      )}

      {kind === "future" && (
        <p className="text-sm font-medium text-secondary">Запланировано задач — {stats.total}</p>
      )}
    </CusCardbox>
  );
}
