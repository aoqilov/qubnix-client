import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { WeekDayCell } from "@/utils/weekDays";
import { toDateKey } from "@/utils/weekDays";

interface CalendarWeekStripProps {
  days: WeekDayCell[];
  onSelectDay: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const navClass =
  "flex h-8 w-6 flex-none items-center justify-center rounded-input border border-subtle bg-surface text-secondary transition-colors hover:border-focus";

export function CalendarWeekStrip({ days, onSelectDay, onPrevWeek, onNextWeek }: CalendarWeekStripProps) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onPrevWeek} className={navClass}>
        <LuChevronLeft size={14} />
      </button>

      <div className="grid flex-1 grid-cols-7 gap-2">
        {days.map((day) => {
          const numberColor = day.isSelected
            ? "text-on-brand"
            : day.isWeekend
              ? "text-error-strong"
              : "text-primary";
          return (
            <button
              key={toDateKey(day.date)}
              type="button"
              onClick={() => onSelectDay(day.date)}
              className="group h-14 focus:outline-none"
              // O'tgan kunlar yengil xiralashadi — tanlanganda to'liq ko'rinadi.
              style={{ opacity: day.isPast && !day.isSelected ? 0.5 : 1 }}
            >
              {/* Chakra reset `button` fonini shaffof qiladi — fon ichki span'da. */}
              <span
                className={`flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-card border transition-colors ${
                  day.isSelected
                    ? "border-brand bg-brand"
                    : day.isToday
                      ? "border-brand bg-surface-secondary"
                      : "border-transparent bg-surface-secondary group-hover:border-subtle"
                }`}
              >
                <span className={`font-condensed text-lg font-semibold leading-none ${numberColor}`}>
                  {day.dayNumber}
                </span>
                <span className={`text-[11px] font-medium ${day.isSelected ? "text-on-brand" : "text-secondary"}`}>
                  {day.weekdayLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onNextWeek} className={navClass}>
        <LuChevronRight size={14} />
      </button>
    </div>
  );
}
