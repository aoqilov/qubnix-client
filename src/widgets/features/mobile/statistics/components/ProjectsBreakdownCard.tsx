import { useTranslation } from "react-i18next";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import type { ProjectStat } from "../types";

function ProjectRow({ project }: { project: ProjectStat }) {
  const percent = project.total > 0 ? (project.done / project.total) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-semibold text-primary">{project.name}</span>
        <span className="flex-none text-sm font-semibold text-secondary">
          {project.done}/{project.total}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

interface ProjectsBreakdownCardProps {
  projects: ProjectStat[];
}

export function ProjectsBreakdownCard({ projects }: ProjectsBreakdownCardProps) {
  const { t } = useTranslation();
  return (
    <CusCardbox
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex flex-col gap-4 rounded-card bg-surface"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{t("statistics.projects.title")}</span>
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </div>
    </CusCardbox>
  );
}
