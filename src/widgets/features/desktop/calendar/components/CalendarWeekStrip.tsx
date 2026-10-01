import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import type { WeekDayCell } from "@/utils/weekDays";
import { toDateKey } from "@/utils/weekDays";

interface CalendarWeekStripProps {
  days: WeekDayCell[];
  onSelectDay: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const navClass =
  "group h-14 w-10 flex-none focus:outline-none";
// Chakra reset `button` fonini shaffof qiladi — fon va ikonka rangi ichki span'da.
const navInnerClass =
  "flex h-full w-full items-center justify-center rounded-card bg-brand text-on-brand transition-colors group-hover:bg-brand-hover";

const weekVariants = {
  enter: (direction: number) => ({ x: direction * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -48, opacity: 0 }),
};

export function CalendarWeekStrip({ days, onSelectDay, onPrevWeek, onNextWeek }: CalendarWeekStripProps) {
  const intlLocale = useIntlLocale();
  const weekdayName = (date: Date) => {
    const name = new Intl.DateTimeFormat(intlLocale, { weekday: "long" }).format(date);
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Hafta almashganda ro'yxat yo'nalish bo'yicha suriladi (keyingi → chapga, oldingi → o'ngga).
  const weekKey = days[0].date.getTime();
  const prevWeekKey = useRef(weekKey);
  const direction = weekKey >= prevWeekKey.current ? 1 : -1;
  useEffect(() => {
    prevWeekKey.current = weekKey;
  }, [weekKey]);

  return (
    <div className="flex items-end gap-2">
      <button type="button" onClick={onPrevWeek} className={navClass}>
        <span className={navInnerClass}>
          <LuChevronLeft size={20} />
        </span>
      </button>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={weekKey}
        custom={direction}
        variants={weekVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="grid flex-1 grid-cols-7 gap-2"
      >
        {days.map((day) => {
          const numberColor = day.isSelected
            ? "text-on-brand"
            : day.isWeekend
              ? "text-error-strong"
              : "text-primary";
          return (
            <div
              key={toDateKey(day.date)}
              className="flex flex-col gap-1.5"
              // O'tgan kunlar yengil xiralashadi — tanlanganda to'liq ko'rinadi.
              style={{ opacity: day.isPast && !day.isSelected ? 0.5 : 1 }}
            >
              <span
                className={`truncate text-center text-xs font-medium ${day.isSelected ? "text-brand" : "text-secondary"}`}
              >
                {weekdayName(day.date)}
              </span>
              <button
                type="button"
                onClick={() => onSelectDay(day.date)}
                className="group h-14 focus:outline-none"
              >
                {/* Chakra reset `button` fonini shaffof qiladi — fon ichki span'da. */}
                <span
                  className={`relative flex h-full w-full items-center justify-center rounded-card border transition-colors ${
                    day.isSelected
                      ? "border-brand bg-surface-secondary"
                      : day.isToday
                        ? "border-brand bg-surface-secondary"
                        : "border-transparent bg-surface-secondary group-hover:border-subtle"
                  }`}
                >
                  {day.isSelected && (
                    <motion.span
                      layoutId="calendar-selected-day"
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                      className="absolute inset-0 rounded-card bg-brand"
                    />
                  )}
                  <span className={`relative font-condensed text-lg font-semibold leading-none ${numberColor}`}>
                    {day.dayNumber}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </motion.div>
      </AnimatePresence>

      <button type="button" onClick={onNextWeek} className={navClass}>
        <span className={navInnerClass}>
          <LuChevronRight size={20} />
        </span>
      </button>
    </div>
  );
}
