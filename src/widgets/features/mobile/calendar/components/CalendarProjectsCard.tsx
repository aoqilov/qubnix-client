import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import {
  LuCalendarPlus,
  LuChevronRight,
  LuCoffee,
  LuHistory,
  LuTriangleAlert,
} from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { avatarColorVar } from "@/utils/avatarColor";
import { projectsLabel, tasksLabel } from "@/utils/countLabels";
import type { DayKind } from "@/utils/apiDate";
import type { CalendarProjectSummary } from "../types";

interface CalendarProjectRowProps {
  project: CalendarProjectSummary;
  dayKind: DayKind;
  onClick: () => void;
}

// Matnlar: calendar.empty.<past|today|future>.title/hint
const EMPTY_ICON: Record<DayKind, ReactNode> = {
  past: <LuHistory size={22} />,
  today: <LuCoffee size={22} />,
  future: <LuCalendarPlus size={22} />,
};

/** Bo'sh/xato holati uchun umumiy blok — ikonka doirada, sarlavha va izoh. */
function StateBlock({
  icon,
  title,
  hint,
  tone = "neutral",
}: {
  icon: ReactNode;
  title: string;
  hint: string;
  tone?: "neutral" | "error";
}) {
  return (
    <CusCardbox
      className="flex flex-col items-center gap-2 rounded-card bg-surface py-10 text-center"
      style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}
    >
      <span
        className={`flex size-12 items-center justify-center rounded-avatar ${
          tone === "error" ? "bg-error-soft text-error-strong" : "bg-brand-subtle text-brand"
        }`}
      >
        {icon}
      </span>
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="max-w-[240px] text-xs text-secondary">{hint}</p>
    </CusCardbox>
  );
}

function ProjectRowSkeleton() {
  return <div className="h-[66px] animate-pulse rounded-card border border-subtle bg-surface" />;
}

function ProjectStatus({ project, dayKind }: { project: CalendarProjectSummary; dayKind: DayKind }) {
  const { t } = useTranslation();
  if (dayKind === "future") {
    return <span className="text-sm font-semibold text-primary">{tasksLabel(project.total)}</span>;
  }
  if (dayKind === "past") {
    const notDone = project.total - project.done;
    return notDone > 0 ? (
      <span className="text-sm font-semibold text-error-strong">{t("calendar.projects.overdueCount", { count: notDone })}</span>
    ) : (
      <span className="text-sm font-semibold text-success-strong">{t("calendar.projects.completed")}</span>
    );
  }
  return project.isOverdue ? (
    <span className="text-sm font-semibold text-error-strong">{t("calendar.projects.overdue")}</span>
  ) : (
    <span className="text-sm font-semibold text-primary">
      {project.done}/{project.total}
    </span>
  );
}

function CalendarProjectRow({ project, dayKind, onClick }: CalendarProjectRowProps) {
  const accent = avatarColorVar(project.id);
  const percent = project.total > 0 ? (project.done / project.total) * 100 : 0;

  return (
    <CusCardbox
      onClick={onClick}
      // CusCardbox default'da --border-default beradi; mockup'da chegara
      // ancha yumshoq, shuning uchun inline style bilan --border-subtle.
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex cursor-pointer gap-3 rounded-card bg-surface transition-colors hover:border-focus"
    >
      <span
        className="flex size-10 flex-none items-center justify-center rounded-input text-sm font-semibold text-on-brand"
        style={{ background: accent }}
      >
        {project.initials}
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <span className="truncate text-base font-semibold text-primary">{project.name}</span>
        {dayKind !== "future" && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
            <div
              className={`h-full rounded-full ${dayKind === "past" ? "bg-success" : "bg-brand"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-none flex-col items-end justify-between gap-2">
        <ProjectStatus project={project} dayKind={dayKind} />
        <LuChevronRight size={16} className="text-disabled" />
      </div>
    </CusCardbox>
  );
}

interface CalendarProjectsCardProps {
  projects: CalendarProjectSummary[];
  dayKind: DayKind;
  onSelectProject: (project: CalendarProjectSummary) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function CalendarProjectsCard({
  projects,
  dayKind,
  onSelectProject,
  isLoading,
  isError,
}: CalendarProjectsCardProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
          {t("calendar.projects.title")}
        </span>
        <span className="text-[11px] font-medium text-secondary">
          {projectsLabel(projects.length)}
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <ProjectRowSkeleton />
          <ProjectRowSkeleton />
        </div>
      ) : isError ? (
        <StateBlock
          tone="error"
          icon={<LuTriangleAlert size={22} />}
          title={t("common.states.loadError")}
          hint={t("common.states.loadErrorHint")}
        />
      ) : projects.length === 0 ? (
        <StateBlock
          icon={EMPTY_ICON[dayKind]}
          title={t(`calendar.empty.${dayKind}.title`)}
          hint={t(`calendar.empty.${dayKind}.hint`)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <CalendarProjectRow
              key={project.id}
              project={project}
              dayKind={dayKind}
              onClick={() => onSelectProject(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
