import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { avatarColorVar } from "@/utils/avatarColor";
import { projectsLabel, tasksWordLabel } from "@/utils/countLabels";

export interface CalendarProjectSummary {
  id: string;
  name: string;
  initials: string;
  done: number;
  total: number;
}

interface CalendarProjectsGridProps {
  projects: CalendarProjectSummary[];
  onSelectProject: (project: CalendarProjectSummary) => void;
  isLoading?: boolean;
  isError?: boolean;
}

function ProjectCard({ project, onClick }: { project: CalendarProjectSummary; onClick: () => void }) {
  const { t } = useTranslation();
  const percent = project.total > 0 ? Math.round((project.done / project.total) * 100) : 0;

  return (
    <CusCardbox
      onClick={onClick}
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex cursor-pointer flex-col gap-4 rounded-card bg-surface transition-colors hover:border-focus"
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-8 flex-none items-center justify-center rounded-input text-xs font-semibold text-on-brand"
          style={{ background: avatarColorVar(project.id) }}
        >
          {project.initials}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">{project.name}</span>
        <span className="font-condensed text-xl font-semibold text-brand">{percent}%</span>
        <LuChevronRight size={14} className="text-disabled" />
      </div>

      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <span className="font-condensed text-2xl font-semibold leading-none text-brand">{project.total}</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-secondary">
            {tasksWordLabel(project.total)}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-end gap-1">
          <span className="text-[10px] font-medium text-success-strong">
            {t("calendar.projects.doneCount", { count: project.done })}
          </span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
            <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </CusCardbox>
  );
}

export function CalendarProjectsGrid({ projects, onSelectProject, isLoading, isError }: CalendarProjectsGridProps) {
  const { t } = useTranslation();
  const gridClass = "grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
          {t("calendar.projects.title")}
        </span>
        <span className="text-[11px] font-medium text-secondary">{projectsLabel(projects.length)}</span>
      </div>

      {isLoading ? (
        <div className={gridClass}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[104px] animate-pulse rounded-card border border-subtle bg-surface" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-10 text-center text-sm text-error-strong">{t("common.states.loadError")}</p>
      ) : projects.length === 0 ? (
        <p className="py-10 text-center text-sm text-secondary">{t("calendar.empty.today.title")}</p>
      ) : (
        <div className={gridClass}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project)} />
          ))}
        </div>
      )}
    </div>
  );
}
