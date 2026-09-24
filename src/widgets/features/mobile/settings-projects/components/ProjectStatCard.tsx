import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import TaskAvatarGroup from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import TaskStatGrid from "@/components/shared/task-stat-grid/TaskStatGrid";
import { tagColorVar } from "@/utils/tagColor";
import type { ProjectStatsItem } from "../types";

interface ProjectStatCardProps {
  project: ProjectStatsItem;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectStatCard({ project, onOpen, onEdit, onDelete }: ProjectStatCardProps) {
  const { t } = useTranslation();
  const tagColor = tagColorVar(project.id);

  return (
    <CusCardbox
      className="flex flex-col gap-4 rounded-input"
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-11 flex-none items-center justify-center rounded-input text-sm font-semibold text-on-brand"
          style={{ background: tagColor }}
        >
          {project.initials}
        </span>
        <span className="min-w-0 flex-1 truncate text-base font-semibold text-primary">
          {project.name}
        </span>
        <span className="flex items-center gap-1 text-lg font-bold text-brand">
          {project.percent}%
          <LuChevronRight size={18} />
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${project.percent}%`, background: tagColor }}
        />
      </div>

      <TaskStatGrid
        done={project.done}
        completed={project.completed}
        inProgress={project.inProgress}
        overdue={project.overdue}
      />

      <TaskAvatarGroup members={project.members} overflowCount={project.overflowCount} />

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <CusButton
          variant="outline"
          size="sm"
          rounded="9999px"
          className="flex-1"
          style={{ borderColor: "var(--brand-default)", color: "var(--brand-default)" }}
          onClick={onEdit}
        >
          {t("common.actions.edit")}
        </CusButton>
        <CusButton
          variant="outline"
          colorPalette="red"
          size="sm"
          rounded="9999px"
          className="flex-1"
          onClick={onDelete}
        >
          {t("common.actions.delete")}
        </CusButton>
      </div>
    </CusCardbox>
  );
}
