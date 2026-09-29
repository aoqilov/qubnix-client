import { useTranslation } from "react-i18next";
import { IoFlagSharp } from "react-icons/io5";
import { LuCirclePlay, LuClock, LuPaperclip, LuSquareCheck } from "react-icons/lu";
import type { RawTask } from "@/api/tasks/tasks.types";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import TaskMetaBadge from "@/components/shared/task-card/mini-components/TaskMetaBadge";
import TaskAvatarGroup from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import TaskStatusLabel from "@/components/shared/task-card/mini-components/TaskStatusLabel";
import { PRIORITY_FLAG_COLOR } from "@/components/shared/task-card/TaskCard";
import { formatDueLabel, formatStartLabel, isTaskOverdue } from "@/utils/taskDateLabels";
import { toTaskView } from "../lib/taskView";
import { TaskStatusMenu } from "./TaskStatusMenu";

interface TaskTileProps {
  task: RawTask;
  projectName: string;
  readOnly: boolean;
  onStatusChange: (nextStatusId: string) => void;
  onOpen: () => void;
}

/** Grid ko'rinishidagi karta — kengaymaydi, bosilganda tafsilot drawer'i ochiladi. */
export function TaskTile({ task, projectName, readOnly, onStatusChange, onOpen }: TaskTileProps) {
  const { t } = useTranslation();
  const view = toTaskView(task);
  const startLabel = formatStartLabel(task);

  return (
    <CusCardbox
      onClick={onOpen}
      role="button"
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex cursor-pointer flex-col gap-3 rounded-card transition-colors hover:border-focus"
    >
      <div className="flex items-start gap-2">
        <TaskStatusMenu
          statusId={view.meta.id}
          color={view.meta.color}
          readOnly={readOnly}
          onChange={onStatusChange}
        />
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 text-sm font-semibold text-primary">{task.title}</span>
          <span className="block truncate text-[11px] font-medium uppercase tracking-wide text-secondary">
            {projectName}
          </span>
        </span>
        <span className="flex-none" style={{ color: PRIORITY_FLAG_COLOR[task.priority ?? "low"] }}>
          <IoFlagSharp size={14} />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {startLabel && (
          <TaskMetaBadge icon={<LuCirclePlay size={12} />} label={startLabel} bg="var(--bg-surface-secondary)" />
        )}
        <TaskMetaBadge
          icon={<LuClock size={12} />}
          label={formatDueLabel(task)}
          bg={isTaskOverdue(task) ? "var(--status-error-bg)" : "var(--bg-surface-secondary)"}
        />
        {task.subtasks.length > 0 && (
          <TaskMetaBadge
            icon={<LuSquareCheck size={12} />}
            label={`${view.doneSubtasks}/${task.subtasks.length}`}
            bg="color-mix(in srgb, var(--accent-orange) 16%, transparent)"
          />
        )}
        {view.attachmentsCount > 0 && (
          <TaskMetaBadge
            icon={<LuPaperclip size={12} />}
            label={String(view.attachmentsCount)}
            bg="var(--status-error-bg)"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <TaskAvatarGroup members={view.members} max={3} />
        <TaskStatusLabel label={t(view.meta.labelKey)} color={view.meta.color} withBg />
      </div>
    </CusCardbox>
  );
}
