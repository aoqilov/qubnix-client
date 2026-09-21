import { useMemo, useState } from "react";
import type React from "react";
import { parseDate } from "@internationalized/date";
import { LuCalendarDays } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CalendarDayInfoBox } from "./components/CalendarDayInfoBox";
import { CalendarProjectsCard } from "./components/CalendarProjectsCard";
import { CalendarWeekStrip } from "./components/CalendarWeekStrip";
import { addDays, buildWeekDays, formatMonthLabel, getWeekStart, toDateKey } from "./lib/calendarWeek";
import { getMockDayProjects, MOCK_EVENT_DATES } from "./lib/mockCalendar";

const monthToggleStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "var(--radius-card)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-surface)",
};

export default function FeatureCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [direction, setDirection] = useState(0);
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const days = useMemo(
    () => buildWeekDays(weekStart, selectedDate, MOCK_EVENT_DATES),
    [weekStart, selectedDate]
  );
  const dayProjects = useMemo(() => getMockDayProjects(selectedDate), [selectedDate]);

  function shiftWeek(offsetDays: number) {
    setDirection(offsetDays > 0 ? 1 : -1);
    setWeekStart((prev) => addDays(prev, offsetDays));
  }

  function handlePickDate(date: Date) {
    const newWeekStart = getWeekStart(date);
    setDirection(
      newWeekStart.getTime() === weekStart.getTime() ? 0 : newWeekStart.getTime() > weekStart.getTime() ? 1 : -1
    );
    setSelectedDate(date);
    setWeekStart(newWeekStart);
    setCalendarOpen(false);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* title */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-condensed text-3xl font-semibold leading-none text-primary">Календарь</h1>
          <p className="mt-1.5 text-xs font-semibold tracking-widest text-brand">{formatMonthLabel(weekStart)}</p>
        </div>
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className="flex flex-none items-center justify-center text-secondary"
          style={monthToggleStyle}
        >
          <LuCalendarDays size={20} />
        </button>
      </div>

      {/* calendar content */}
      <CalendarWeekStrip
        days={days}
        direction={direction}
        onSelectDay={setSelectedDate}
        onPrevWeek={() => shiftWeek(-7)}
        onNextWeek={() => shiftWeek(7)}
      />

      {/* day-info-box */}
      <CalendarDayInfoBox date={selectedDate} />

      {/* projects-row */}
      <CalendarProjectsCard projects={dayProjects} />

      <CusDialog open={isCalendarOpen} onClose={() => setCalendarOpen(false)} title="Выберите дату" centered size="sm">
        <CusCalendar
          inline
          value={[parseDate(toDateKey(selectedDate))]}
          onValueChange={({ value }) => {
            const picked = value[0];
            if (picked) handlePickDate(new Date(picked.year, picked.month - 1, picked.day));
          }}
        />
      </CusDialog>
    </div>
  );
}
