import { useTranslation } from "react-i18next";
import { LuChevronRight } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { avatarColorVar } from "@/utils/avatarColor";
import { initialsOf } from "@/utils/calendarDay";

export interface PickableProject {
  id: string;
  name: string;
}

interface ProjectPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  projects: PickableProject[];
  onSelect: (project: PickableProject) => void;
  /** Mobil — tepadan tushadigan panel (default), desktop — markazdagi dialog. */
  variant?: "drawer" | "dialog";
}

/** "Добавить задачу" bosilganda loyiha tanlash: mobil'da tepadan panel, desktop'da dialog. */
export function ProjectPickerDrawer({
  open,
  onClose,
  projects,
  onSelect,
  variant = "drawer",
}: ProjectPickerDrawerProps) {
  const { t } = useTranslation();
  const title = t("calendar.addTask.pickProject");
  const rows = (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <CusCardbox
          key={project.id}
          onClick={() => onSelect(project)}
          style={{ borderColor: "var(--border-subtle)" }}
          className="flex cursor-pointer items-center gap-3 rounded-card bg-surface transition-colors hover:border-focus"
        >
          <span
            className="flex size-10 flex-none items-center justify-center rounded-input text-sm font-semibold text-on-brand"
            style={{ background: avatarColorVar(project.id) }}
          >
            {initialsOf(project.name)}
          </span>
          <span className="min-w-0 flex-1 truncate text-base font-semibold text-primary">{project.name}</span>
          <LuChevronRight size={16} className="flex-none text-disabled" />
        </CusCardbox>
      ))}
    </div>
  );

  if (variant === "dialog") {
    return (
      <CusDialog open={open} onClose={onClose} title={title} centered size="sm">
        {rows}
      </CusDialog>
    );
  }
  return (
    <CusDrawer open={open} onClose={onClose} placement="top" title={title}>
      {rows}
    </CusDrawer>
  );
}
