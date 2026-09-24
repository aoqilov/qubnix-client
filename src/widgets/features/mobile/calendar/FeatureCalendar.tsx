import { useMemo, useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { parseDate } from "@internationalized/date";
import { LuCalendarDays } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CalendarDayInfoBox } from "./components/CalendarDayInfoBox";
import { CalendarProjectsCard } from "./components/CalendarProjectsCard";
import { CalendarWeekStrip } from "./components/CalendarWeekStrip";
import { addDays, buildWeekDays, formatMonthLabel, getWeekStart, toDateKey } from "@/utils/weekDays";
import { useCalendarDay } from "./hooks/useApiCalendar";
import type { CalendarProjectSummary, DayTaskStats } from "./types";
import { getDayKind, toApiDate } from "@/utils/apiDate";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { TaskStatusTotals } from "@/api/tasks/tasks.types";

const monthToggleStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "var(--radius-card)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-surface)",
};

const EMPTY_STATS: DayTaskStats = { total: 0, done: 0, overdue: 0, left: 0 };

function toDayStats(t: TaskStatusTotals): DayTaskStats {
  return { total: t.total, done: t.done, overdue: t.not_done, left: t.todo + t.in_progress };
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

export default function FeatureCalendar() {
  const navigate = useNavigate();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [direction, setDirection] = useState(0);
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const days = useMemo(() => buildWeekDays(weekStart, selectedDate), [weekStart, selectedDate]);

  const dayQuery = useCalendarDay(organizationId, toApiDate(selectedDate));
  const dayStats = dayQuery.data ? toDayStats(dayQuery.data.totals) : EMPTY_STATS;
  // Shu kunda vazifasi yo'q loyihalar ko'rsatilmaydi.
  const dayProjects: CalendarProjectSummary[] = (dayQuery.data?.projects ?? [])
    .filter((p) => p.totals.total > 0)
    .map((p) => ({
    id: String(p.id),
    name: p.name,
    initials: initialsOf(p.name),
    done: p.totals.done,
    total: p.totals.total,
    isOverdue: p.totals.not_done > 0,
  }));

  function shiftWeek(offsetDays: number) {
    setDirection(offsetDays > 0 ? 1 : -1);
    setWeekStart((prev) => addDays(prev, offsetDays));
  }

  // Loyiha ustiga bosilganda /tasks'ga shu kun va shu loyiha tab'i bilan
  // o'tadi — ro'yxat "bugun"/birinchi loyiha emas, tanlangan kontekstda ochiladi.
  function handleSelectProject(project: CalendarProjectSummary) {
    navigate("/tasks", { state: { date: toApiDate(selectedDate), projectId: project.id } });
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
      <CalendarDayInfoBox date={selectedDate} stats={dayStats} />

      {/* projects-row */}
      <CalendarProjectsCard
        projects={dayProjects}
        dayKind={getDayKind(selectedDate)}
        onSelectProject={handleSelectProject}
        isLoading={dayQuery.isPending && !!organizationId}
        isError={dayQuery.isError}
      />

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
