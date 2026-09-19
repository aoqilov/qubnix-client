import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { CalendarDayCell } from "../types";
import { toDateKey } from "../lib/calendarWeek";

const navButtonStyle: React.CSSProperties = {
  width: 34,
  height: 44,
  borderRadius: "var(--radius-input)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-surface)",
};

interface CalendarWeekStripProps {
  days: CalendarDayCell[];
  direction: number;
  onSelectDay: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function CalendarWeekStrip({ days, direction, onSelectDay, onPrevWeek, onNextWeek }: CalendarWeekStripProps) {
  const weekKey = toDateKey(days[0].date);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="flex-none" style={{ width: 34 }} />
        {days.map((day) => (
          <span key={toDateKey(day.date)} className="flex-1 text-center text-xs font-medium text-secondary">
            {day.weekdayLabel}
          </span>
        ))}
        <span className="flex-none" style={{ width: 34 }} />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrevWeek}
          className="flex flex-none items-center justify-center text-secondary"
          style={navButtonStyle}
        >
          <LuChevronLeft size={17} />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={weekKey}
              custom={direction}
              initial={{ x: direction * 36, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -36, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex items-center gap-1.5"
            >
              {days.map((day) => {
                const dateColor = day.isSelected
                  ? "var(--text-on-brand)"
                  : day.isWeekend
                  ? "var(--status-error-text)"
                  : "var(--text-primary)";

                return (
                  <button
                    key={toDateKey(day.date)}
                    type="button"
                    onClick={() => onSelectDay(day.date)}
                    className="relative flex h-11 flex-1 items-center justify-center"
                  >
                    {day.isSelected && (
                      <motion.span
                        layoutId="calendar-selected-day"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute inset-0"
                        style={{ background: "var(--brand-default)", borderRadius: "var(--radius-card)" }}
                      />
                    )}
                    {day.hasEvent && (
                      <span
                        className="absolute -top-0.5 h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--status-error-solid)" }}
                      />
                    )}
                    <span
                      className="relative font-condensed text-lg font-semibold leading-none"
                      style={{ color: dateColor }}
                    >
                      {day.dayNumber}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onNextWeek}
          className="flex flex-none items-center justify-center text-secondary"
          style={navButtonStyle}
        >
          <LuChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
