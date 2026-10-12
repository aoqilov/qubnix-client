import { useTranslation } from "react-i18next";
import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { parseDate } from "@internationalized/date";
import { LuCalendarDays } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CalendarDayInfoBox } from "./components/CalendarDayInfoBox";
import { CalendarProjectsCard } from "./components/CalendarProjectsCard";
import { WeekStrip } from "@/components/shared/week-strip/WeekStrip";
import { useWeekStrip } from "@/components/shared/week-strip/useWeekStrip";
import { formatMonthLabel, toDateKey } from "@/utils/weekDays";
import { useCalendarDay } from "@/hooks/useApiCalendar";
import type { CalendarProjectSummary, DayTaskStats } from "./types";
import { getDayKind, toApiDate } from "@/utils/apiDate";
import { useCalendarAddTask } from "@/hooks/useCalendarAddTask";
import { ProjectPickerDrawer } from "@/components/shared/project-picker/ProjectPickerDrawer";
import TaskAddButton, { TASK_ADD_BUTTON_OFFSET } from "@/components/shared/task-button/TaskAddButton";
import TaskModalAdd from "@/components/shared/task-modals/TaskModalAdd";
import { ErrorToast, useErrorToast } from "@/components/shared/error-toast/ErrorToast";
import { useWorkspaceStore } from "@/store/workspace.store";
import { initialsOf, toDayStats } from "@/utils/calendarDay";

const monthToggleStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "var(--radius-card)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-surface)",
};

const EMPTY_STATS: DayTaskStats = { total: 0, done: 0, overdue: 0, left: 0 };

export default function FeatureCalendar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const { days, direction, weekStart, shiftWeek, showWeekOf } = useWeekStrip(selectedDate);

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

  const errorToast = useErrorToast();
  const addTask = useCalendarAddTask({
    organizationId,
    date: selectedDate,
    onError: errorToast.show,
  });

  // Loyiha ustiga bosilganda /tasks'ga shu kun va shu loyiha tab'i bilan
  // o'tadi — ro'yxat "bugun"/birinchi loyiha emas, tanlangan kontekstda ochiladi.
  function handleSelectProject(project: CalendarProjectSummary) {
    navigate("/tasks", { state: { date: toApiDate(selectedDate), projectId: project.id } });
  }

  function handlePickDate(date: Date) {
    showWeekOf(date);
    setSelectedDate(date);
    setCalendarOpen(false);
  }

  return (
    <div
      className="flex flex-col gap-4 p-4"
      style={{ paddingBottom: addTask.canAdd ? `calc(${TASK_ADD_BUTTON_OFFSET} + 56px + 12px)` : undefined }}
    >
      {/* title */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-condensed text-3xl font-semibold leading-none text-primary">{t("calendar.title")}</h1>
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
      <WeekStrip
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

      {addTask.canAdd && <TaskAddButton onClick={addTask.start} />}

      <ProjectPickerDrawer {...addTask.picker} />

      <TaskModalAdd {...addTask.modal} />

      <ErrorToast message={errorToast.message} onClose={errorToast.hide} />

      <CusDialog open={isCalendarOpen} onClose={() => setCalendarOpen(false)} title={t("calendar.pickDate")} centered size="sm">
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
