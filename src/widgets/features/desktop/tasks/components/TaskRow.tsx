import { useTranslation } from "react-i18next";
import { IoFlagSharp } from "react-icons/io5";
import { LuCirclePlay, LuClock, LuPaperclip, LuSquareCheck } from "react-icons/lu";
import type { RawTask } from "@/api/tasks/tasks.types";
import TaskMetaBadge from "@/components/shared/task-card/mini-components/TaskMetaBadge";
import TaskAvatarGroup from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import TaskStatusLabel from "@/components/shared/task-card/mini-components/TaskStatusLabel";
import { PRIORITY_FLAG_COLOR } from "@/components/shared/task-card/TaskCard";
import { formatDueLabel, formatStartLabel, isTaskOverdue } from "@/utils/taskDateLabels";
import { toTaskView } from "../lib/taskView";
import { TaskStatusMenu } from "./TaskStatusMenu";

interface TaskRowProps {
  task: RawTask;
  projectName: string;
  readOnly: boolean;
  onStatusChange: (nextStatusId: string) => void;
  onOpen: () => void;
}

/** Ro'yxat ko'rinishidagi ixcham qator — bosilganda o'ng tomonda tafsilot drawer'i ochiladi. */
export function TaskRow({ task, projectName, readOnly, onStatusChange, onOpen }: TaskRowProps) {
  const { t } = useTranslation();
  const view = toTaskView(task);
  const startLabel = formatStartLabel(task);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-secondary"
    >
      <TaskStatusMenu
        statusId={view.meta.id}
        color={view.meta.color}
        readOnly={readOnly}
        onChange={onStatusChange}
      />
      <span className="flex-none" style={{ color: PRIORITY_FLAG_COLOR[task.priority ?? "low"] }}>
        <IoFlagSharp size={14} />
      </span>
      <span className="flex-none">
        <TaskAvatarGroup members={view.members} max={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-primary">{task.title}</span>
        <span className="block truncate text-[11px] font-medium uppercase tracking-wide text-secondary">
          {projectName}
        </span>
      </span>

      <span className="flex flex-none items-center gap-2">
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
        <span className="w-[104px] text-right">
          <TaskStatusLabel label={t(view.meta.labelKey)} color={view.meta.color} withBg />
        </span>
      </span>
    </div>
  );
}
