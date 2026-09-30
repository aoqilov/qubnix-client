import { useTranslation } from "react-i18next";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import type { TaskStatusTotals } from "@/api/tasks/tasks.types";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface CalendarDayInfoBoxProps {
  date: Date;
  totals: TaskStatusTotals;
}

export function CalendarDayInfoBox({ date, totals }: CalendarDayInfoBoxProps) {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  // Intl uz locale'da "30/09/2026" beradi — dizayn har doim nuqtali format.
  const dateLabel = [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join(".");
  const weekdayLabel = capitalize(new Intl.DateTimeFormat(intlLocale, { weekday: "long" }).format(date));
  const donePercent = totals.total > 0 ? (totals.done / totals.total) * 100 : 0;

  const stats = [
    { label: t("calendar.dayInfo.total"), value: totals.total, color: "text-primary" },
    { label: t("common.taskStatus.todo"), value: totals.todo, color: "text-info-strong" },
    { label: t("common.taskStatus.in_progress"), value: totals.in_progress, color: "text-progress-strong" },
    { label: t("common.taskStatus.done"), value: totals.done, color: "text-success-strong" },
    { label: t("calendar.projects.overdue"), value: totals.not_done, color: "text-error-strong" },
  ];

  return (
    <CusCardbox
      className="flex items-center justify-between gap-6 rounded-card bg-surface px-5 py-4"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="flex-none">
        <p className="font-condensed text-3xl font-semibold leading-none text-primary">{dateLabel}</p>
        <p className="mt-1.5 text-sm text-secondary">{weekdayLabel}</p>
      </div>

      <div className="flex w-full max-w-[460px] flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start">
              <span className={`font-condensed text-2xl font-semibold leading-none ${stat.color}`}>{stat.value}</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
          <div className="h-full rounded-full bg-brand" style={{ width: `${donePercent}%` }} />
        </div>
      </div>
    </CusCardbox>
  );
}
