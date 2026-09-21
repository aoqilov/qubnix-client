import { LuChevronRight } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { avatarColorVar } from "@/utils/avatarColor";
import { projectsLabel } from "@/utils/pluralRu";
import type { CalendarProjectSummary } from "../types";

interface CalendarProjectRowProps {
  project: CalendarProjectSummary;
}

function CalendarProjectRow({ project }: CalendarProjectRowProps) {
  const accent = avatarColorVar(project.id);
  const percent = project.total > 0 ? (project.done / project.total) * 100 : 0;

  return (
    <CusCardbox
      // CusCardbox default'da --border-default beradi; mockup'da chegara
      // ancha yumshoq, shuning uchun inline style bilan --border-subtle.
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex gap-3 rounded-card bg-surface"
    >
      <span
        className="flex size-10 flex-none items-center justify-center rounded-input text-sm font-semibold text-on-brand"
        style={{ background: accent }}
      >
        {project.initials}
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <span className="truncate text-base font-semibold text-primary">{project.name}</span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
          <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="flex flex-none flex-col items-end justify-between gap-2">
        {project.isOverdue ? (
          <span className="text-sm font-semibold text-error-strong">Просрочено</span>
        ) : (
          <span className="text-sm font-semibold text-primary">
            {project.done}/{project.total}
          </span>
        )}
        <LuChevronRight size={16} className="text-disabled" />
      </div>
    </CusCardbox>
  );
}

interface CalendarProjectsCardProps {
  projects: CalendarProjectSummary[];
}

export function CalendarProjectsCard({ projects }: CalendarProjectsCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Проекты</span>
        <span className="text-[11px] font-medium text-secondary">{projectsLabel(projects.length)}</span>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <CalendarProjectRow key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
