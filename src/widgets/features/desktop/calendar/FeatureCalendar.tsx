import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { parseDate } from "@internationalized/date";
import { LuCalendarDays } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { useCalendarDay } from "@/hooks/useApiCalendar";
import { useWorkspaceStore } from "@/store/workspace.store";
import { toApiDate } from "@/utils/apiDate";
import { initialsOf } from "@/utils/calendarDay";
import {
  addDays,
  buildWeekDays,
  formatMonthLabel,
  getWeekStart,
  toDateKey,
} from "@/utils/weekDays";
import type { TaskStatusTotals } from "@/api/tasks/tasks.types";
import { CalendarDayInfoBox } from "./components/CalendarDayInfoBox";
import {
  CalendarProjectsGrid,
  type CalendarProjectSummary,
} from "./components/CalendarProjectsGrid";
import { CalendarWeekStrip } from "./components/CalendarWeekStrip";

const EMPTY_TOTALS: TaskStatusTotals = {
  total: 0,
  todo: 0,
  in_progress: 0,
  done: 0,
  not_done: 0,
};

export default function FeatureCalendar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const days = useMemo(
    () => buildWeekDays(weekStart, selectedDate),
    [weekStart, selectedDate],
  );

  const dayQuery = useCalendarDay(organizationId, toApiDate(selectedDate));
  // Shu kunda vazifasi yo'q loyihalar ko'rsatilmaydi.
  const projects: CalendarProjectSummary[] = (dayQuery.data?.projects ?? [])
    .filter((p) => p.totals.total > 0)
    .map((p) => ({
      id: String(p.id),
      name: p.name,
      initials: initialsOf(p.name),
      done: p.totals.done,
      total: p.totals.total,
    }));

  function handleSelectProject(project: CalendarProjectSummary) {
    navigate("/tasks", {
      state: { date: toApiDate(selectedDate), projectId: project.id },
    });
  }

  const todayKey = toDateKey(new Date());
  const isTodayView = toDateKey(selectedDate) === todayKey && toDateKey(weekStart) === toDateKey(getWeekStart(new Date()));

  function handleBackToToday() {
    const now = new Date();
    setSelectedDate(now);
    setWeekStart(getWeekStart(now));
  }

  function handlePickDate(date: Date) {
    setSelectedDate(date);
    setWeekStart(getWeekStart(date));
    setCalendarOpen(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <CusPageTitle
        className=""
        title={t("calendar.title")}
        subtitle={formatMonthLabel(weekStart)}
        action={
          <div className="flex items-center gap-2">
            {!isTodayView && (
              <button
                type="button"
                onClick={handleBackToToday}
                className="h-9 rounded-input border border-subtle bg-surface px-3 text-sm font-semibold text-brand transition-colors hover:border-focus"
              >
                {t("calendar.backToToday")}
              </button>
            )}
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="flex size-9 flex-none items-center justify-center rounded-input border border-subtle bg-surface text-secondary transition-colors hover:border-focus"
            >
              <LuCalendarDays size={16} />
            </button>
          </div>
        }
      />

      <CalendarWeekStrip
        days={days}
        onSelectDay={setSelectedDate}
        onPrevWeek={() => setWeekStart((prev) => addDays(prev, -7))}
        onNextWeek={() => setWeekStart((prev) => addDays(prev, 7))}
      />

      <CalendarDayInfoBox
        date={selectedDate}
        totals={dayQuery.data?.totals ?? EMPTY_TOTALS}
      />

      <CalendarProjectsGrid
        projects={projects}
        onSelectProject={handleSelectProject}
        isLoading={dayQuery.isPending && !!organizationId}
        isError={dayQuery.isError}
      />

      <CusDialog
        open={isCalendarOpen}
        onClose={() => setCalendarOpen(false)}
        title={t("calendar.pickDate")}
        centered
        size="sm"
      >
        <CusCalendar
          inline
          value={[parseDate(toDateKey(selectedDate))]}
          onValueChange={({ value }) => {
            const picked = value[0];
            if (picked)
              handlePickDate(
                new Date(picked.year, picked.month - 1, picked.day),
              );
          }}
        />
      </CusDialog>
    </div>
  );
}
