import type { ReactNode } from "react";
import { parseDate } from "@internationalized/date";
import { LuClock, LuInfo, LuPencil } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import type { RawTaskRoutine, RoutineFrequency } from "@/api/task-routines/task-routines.types";
import { MONTH_DAYS, MONTH_NOMINATIVE, WEEKDAY_OPTIONS } from "../lib/routineSchedule";
import { formatApiDate, formatDateTime } from "../lib/formatRoutine";

const FREQUENCY_TITLE: Record<RoutineFrequency, string> = {
  daily: "Har kuni",
  weekly: "Har hafta",
  monthly: "Har oy",
  yearly: "Har yili",
};

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
      {WEEKDAY_OPTIONS.map((opt) => (
        <DayCell
          key={opt.value}
          label={<span className="py-2 text-xs">{opt.label}</span>}
          active={activeDays.includes(opt.value)}
        />
      ))}
    </div>
  );
}

function MonthView({ activeDays }: { activeDays: number[] }) {
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
          29, 30 yoki 31-sana qisqa oylarda bo'lmasligi mumkin.
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
        {day}-{MONTH_NOMINATIVE[month - 1]}
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
  return (
    <CusDialog
      open={routine !== null}
      onClose={onClose}
      title="Takrorlanish jadvali"
      size="sm"
      centered
      footer={
        <>
          <CusButton variant="outline" className="flex-1" onClick={onClose}>
            Yopish
          </CusButton>
          <CusButton
            className="flex-1"
            leftIcon={<LuPencil size={16} />}
            onClick={() => routine && onEdit(routine)}
            style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
          >
            Изменить
          </CusButton>
        </>
      }
    >
      {routine && (
        <div className="flex flex-col gap-4">
          {/* Xulosa: chastota + soat */}
          <div className="flex items-center justify-between rounded-card bg-brand-subtle px-4 py-3">
            <span className="text-base font-semibold text-brand">
              {FREQUENCY_TITLE[routine.frequency]}
            </span>
            <span className="flex items-center gap-1.5 text-base font-semibold text-brand">
              <LuClock size={16} />
              {routine.time_of_day}
            </span>
          </div>

          {routine.frequency === "daily" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>Hafta kunlari</SectionTitle>
              <WeekView activeDays={WEEKDAY_OPTIONS.map((o) => o.value)} />
              <span className="text-xs text-secondary">
                Vazifa har kuni soat {routine.time_of_day} da yaratiladi.
              </span>
            </div>
          )}

          {routine.frequency === "weekly" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>Tanlangan hafta kunlari</SectionTitle>
              <WeekView activeDays={routine.weekdays} />
            </div>
          )}

          {routine.frequency === "monthly" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>Oyning tanlangan kunlari</SectionTitle>
              <MonthView activeDays={routine.month_days} />
            </div>
          )}

          {routine.frequency === "yearly" && (
            <div className="flex flex-col gap-2">
              <SectionTitle>Yilning tanlangan kuni</SectionTitle>
              <YearView routine={routine} />
            </div>
          )}

          <div className="flex flex-col divide-y divide-[var(--border-subtle)] border-t border-subtle">
            <InfoRow
              label="Boshlanish soati"
              value={`${routine.time_of_day} (${routine.timezone})`}
            />
            {routine.end_time && <InfoRow label="Tugash soati" value={routine.end_time} />}
            <InfoRow label="Boshlanish" value={formatApiDate(routine.start_date)} />
            <InfoRow
              label="Tugash"
              value={routine.end_date ? formatApiDate(routine.end_date) : "Cheklanmagan"}
            />
            <InfoRow label="Keyingi ishga tushish" value={formatDateTime(routine.next_run_at)} />
            <InfoRow
              label="Oxirgi ishga tushish"
              value={routine.last_run_at ? formatDateTime(routine.last_run_at) : "Hali ishlamagan"}
            />
            <InfoRow label="Holat" value={routine.active ? "Faol" : "O'chiq"} />
          </div>
        </div>
      )}
    </CusDialog>
  );
}
