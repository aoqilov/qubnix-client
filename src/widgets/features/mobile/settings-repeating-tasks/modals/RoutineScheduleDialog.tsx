import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { parseDate } from "@internationalized/date";
import { LuClock, LuInfo, LuPencil } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import type { RawTaskRoutine, RoutineFrequency } from "@/api/task-routines/task-routines.types";
import { MONTH_DAYS, WEEKDAY_VALUES, dayMonthLabel, weekdayShortLabel } from "../lib/routineSchedule";
import { formatApiDate, formatDateTime } from "../lib/formatRoutine";

// Matnlar: routines.schedule.<frequency>
const FREQUENCIES: RoutineFrequency[] = ["daily", "weekly", "monthly", "yearly"];

/** Tanlangan/tanlanmagan kun katakchasi — hafta va oy ko'rinishlari uchun umumiy. */
function DayCell({ label, active }: { label: ReactNode; active: boolean }) {
  return (
    <span
      className="flex h-full w-full items-center justify-center rounded-input text-sm font-semibold"
      style={
        active
          ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
          : { background: "var(--bg-surface-secondary)", color: "var(--text-disabled)" }
      }
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-medium uppercase tracking-wide text-secondary">{children}</span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-secondary">{label}</span>
      <span className="text-right text-sm font-medium text-primary">{value}</span>
    </div>
  );
}

function WeekView({ activeDays }: { activeDays: number[] }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {WEEKDAY_VALUES.map((day) => (
        <DayCell
          key={day}
          label={<span className="py-2 text-xs">{weekdayShortLabel(day)}</span>}
          active={activeDays.includes(day)}
        />
      ))}
    </div>
  );
}

function MonthView({ activeDays }: { activeDays: number[] }) {
  const { t } = useTranslation();
  const hasShortMonthDay = activeDays.some((d) => d >= 29);
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-1.5">
        {MONTH_DAYS.map((d) => (
          <span key={d} className="flex aspect-square">
            <DayCell label={d} active={activeDays.includes(d)} />
          </span>
        ))}
      </div>
      {hasShortMonthDay && (
        <span className="flex items-start gap-1.5 text-xs text-secondary">
          <LuInfo size={14} className="mt-px flex-none" />
          {t("routines.schedule.shortMonthHint")}
        </span>
      )}
    </div>
  );
}

function YearView({ routine }: { routine: RawTaskRoutine }) {
  const [, month, day] = routine.start_date.split("-").map(Number);
  // Kalendar keyingi ishga tushish yilini ko'rsatadi — kun/oy esa start_date'dan.
  const year = new Date(routine.next_run_at).getFullYear();
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = parseDate(`${year}-${pad(month)}-${pad(day)}`);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-2xl font-semibold text-primary">
        {dayMonthLabel(month, day)}
      </span>
      <div className="pointer-events-none w-full">
        <CusCalendar inline readOnly value={[date]} />
      </div>
    </div>
  );
}

interface RoutineScheduleDialogProps {
  routine: RawTaskRoutine | null;
  onClose: () => void;
  onEdit: (routine: RawTaskRoutine) => void;
}

export function RoutineScheduleDialog({ routine, onClose, onEdit }: RoutineScheduleDialogProps) {
  const { t } = useTranslation();
  return (
    <CusDialog
      open={routine !== null}
      onClose={onClose}
      title={t("routines.schedule.title")}
      size="sm"
      centered
      footer={
        <>
          <CusButton variant="outline" className="flex-1" onClick={onClose}>
            {t("common.actions.close")}
          </CusButton>
          <CusButton
            className="flex-1"
            leftIcon={<LuPencil size={16} />}
            onClick={() => routine && onEdit(routine)}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            {t("common.actions.edit")}
          </CusButton>
        </>
      }
    >
      {routine && (
        <div className="flex flex-col gap-4">
          {/* Xulosa: chastota + soat */}
          <div className="flex items-center justify-between rounded-card bg-brand-subtle px-4 py-3">
            <span className="text-base font-semibold text-brand">
              {FREQUENCIES.includes(routine.frequency) && t(`routines.schedule.${routine.frequency}`)}
            </span>
            <span className="flex items-center gap-1.5 text-base font-semibold text-brand">
              <LuClock size={16} />
              {routine.time_of_day}
            </span>
          </div>

          {routine.frequency === "daily" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>{t("routines.schedule.weekdays")}</SectionTitle>
              <WeekView activeDays={[...WEEKDAY_VALUES]} />
              <span className="text-xs text-secondary">
                {t("routines.schedule.dailyHint", { time: routine.time_of_day })}
              </span>
            </div>
          )}

          {routine.frequency === "weekly" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>{t("routines.schedule.selectedWeekdays")}</SectionTitle>
              <WeekView activeDays={routine.weekdays} />
            </div>
          )}

          {routine.frequency === "monthly" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>{t("routines.schedule.selectedMonthDays")}</SectionTitle>
              <MonthView activeDays={routine.month_days} />
            </div>
          )}

          {routine.frequency === "yearly" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>{t("routines.schedule.selectedYearDay")}</SectionTitle>
              <YearView routine={routine} />
            </div>
          )}

          <div className="flex flex-col divide-y divide-[var(--border-subtle)] border-t border-subtle">
            <InfoRow
              label={t("routines.schedule.startTime")}
              value={`${routine.time_of_day} (${routine.timezone})`}
            />
            {routine.end_time && <InfoRow label={t("routines.schedule.endTime")} value={routine.end_time} />}
            <InfoRow label={t("routines.schedule.startDate")} value={formatApiDate(routine.start_date)} />
            <InfoRow
              label={t("routines.schedule.endDate")}
              value={routine.end_date ? formatApiDate(routine.end_date) : t("routines.schedule.unlimited")}
            />
            <InfoRow label={t("routines.schedule.nextRun")} value={formatDateTime(routine.next_run_at)} />
            <InfoRow
              label={t("routines.schedule.lastRun")}
              value={routine.last_run_at ? formatDateTime(routine.last_run_at) : t("routines.schedule.neverRun")}
            />
            <InfoRow
              label={t("routines.schedule.status")}
              value={routine.active ? t("routines.schedule.active") : t("routines.schedule.inactive")}
            />
          </div>
        </div>
      )}
    </CusDialog>
  );
}
