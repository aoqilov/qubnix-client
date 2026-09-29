import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { IoFlagSharp } from "react-icons/io5";
import { LuCirclePlay, LuClock, LuPencil, LuTrash2 } from "react-icons/lu";
import type { RawTask } from "@/api/tasks/tasks.types";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import TaskStatusLabel from "@/components/shared/task-card/mini-components/TaskStatusLabel";
import SubtaskItem from "@/components/shared/task-card/mini-components/SubtaskItem";
import TaskPhotoGrid from "@/components/shared/task-card/mini-components/TaskPhotoGrid";
import TaskFileItem from "@/components/shared/task-card/mini-components/TaskFileItem";
import TaskAudioMessage from "@/components/shared/task-card/mini-components/TaskAudioMessage";
import { PRIORITY_FLAG_COLOR } from "@/components/shared/task-card/TaskCard";
import { avatarColorVar } from "@/utils/avatarColor";
import { formatDayMonth, formatTime, isTaskOverdue } from "@/utils/taskDateLabels";
import { toTaskView } from "../lib/taskView";
import { TaskStatusMenu } from "../components/TaskStatusMenu";

interface TaskDetailsDrawerProps {
  task: RawTask | null;
  projectName: string;
  onClose: () => void;
  /** Status, subtask — viewer yoki o'tgan kunda yopiq. */
  readOnly: boolean;
  /** Tahrirlash/o'chirish — owner/admin yoki shu loyihaning project_manager'i. */
  canManage: boolean;
  onStatusChange: (nextStatusId: string) => void;
  onSubtaskChange: (subtaskId: string, checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-secondary">{label}</span>
      {children}
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDayMonth(d)}.${d.getFullYear()} ${formatTime(d)}`;
}

/** Vazifa tafsiloti — desktop'da karta kengaymaydi, o'ng tomondan drawer ochiladi. */
export function TaskDetailsDrawer({
  task,
  projectName,
  onClose,
  readOnly,
  canManage,
  onStatusChange,
  onSubtaskChange,
  onEdit,
  onDelete,
}: TaskDetailsDrawerProps) {
  const { t } = useTranslation();
  const view = task ? toTaskView(task) : null;
  const showActions = !!task && canManage && !readOnly;

  return (
    <CusDrawer
      open={task !== null}
      onClose={onClose}
      placement="end"
      size="md"
      title={t("tasks.details.title")}
      footer={
        showActions ? (
          <div className="flex w-full gap-2">
            <CusButton
              variant="outline"
              colorPalette="red"
              className="flex-1"
              leftIcon={<LuTrash2 size={16} />}
              onClick={onDelete}
            >
              {t("common.actions.delete")}
            </CusButton>
            <CusButton
              className="flex-1"
              leftIcon={<LuPencil size={16} />}
              onClick={onEdit}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              {t("common.actions.edit")}
            </CusButton>
          </div>
        ) : undefined
      }
    >
      {task && view && (
        <div className="flex flex-col gap-5">
          {/* Nom + status + ustuvorlik */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="pt-1">
                <TaskStatusMenu
                  statusId={view.meta.id}
                  color={view.meta.color}
                  readOnly={readOnly}
                  onChange={onStatusChange}
                />
              </span>
              <h2 className="min-w-0 flex-1 text-lg font-semibold text-primary">{task.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <TaskStatusLabel label={t(view.meta.labelKey)} color={view.meta.color} withBg />
              <CusBadge variant="subtle" tone="neutral">
                <span className="flex items-center gap-1">
                  <span style={{ color: PRIORITY_FLAG_COLOR[task.priority ?? "low"] }}>
                    <IoFlagSharp size={12} />
                  </span>
                  {t(`common.priority.${task.priority ?? "low"}`)}
                </span>
              </CusBadge>
              {projectName && (
                <CusBadge variant="subtle" tone="brand">
                  {projectName}
                </CusBadge>
              )}
            </div>
          </div>

          {/* Muddatlar */}
          <div className="flex flex-col divide-y divide-[var(--border-subtle)] rounded-input border border-subtle bg-surface px-4">
            {task.start_at && (
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="flex items-center gap-2 text-secondary">
                  <LuCirclePlay size={14} />
                  {t("tasks.details.start")}
                </span>
                <span className="font-medium text-primary">{formatDateTime(task.start_at)}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="flex items-center gap-2 text-secondary">
                <LuClock size={14} />
                {t("tasks.details.due")}
              </span>
              <span className={`font-medium ${isTaskOverdue(task) ? "text-error-strong" : "text-primary"}`}>
                {task.due_at ? formatDateTime(task.due_at) : t("tasks.card.noDeadline")}
              </span>
            </div>
          </div>

          {/* Xodimlar */}
          {view.members.length > 0 && (
            <Section label={t("tasks.modal.members")}>
              <div className="flex flex-col gap-2">
                {view.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-2.5">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt=""
                        className="size-8 flex-none rounded-avatar object-cover"
                      />
                    ) : (
                      <span
                        className="flex size-8 flex-none items-center justify-center rounded-avatar text-xs font-semibold text-on-brand"
                        style={{ background: avatarColorVar(member.id) }}
                      >
                        {member.initials}
                      </span>
                    )}
                    <span className="truncate text-sm text-primary">{member.name}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Tavsif */}
          <Section label={t("tasks.modal.description")}>
            {view.descriptionAudio ? (
              <TaskAudioMessage audio={view.descriptionAudio} />
            ) : view.descriptionText ? (
              <p className="whitespace-pre-wrap text-sm text-primary">{view.descriptionText}</p>
            ) : (
              <p className="text-sm text-disabled">{t("tasks.details.noDescription")}</p>
            )}
          </Section>

          {/* Subtasklar */}
          {view.subtasks.length > 0 && (
            <Section label={`${t("tasks.card.subtasks")} · ${view.doneSubtasks}/${view.subtasks.length}`}>
              <div className="flex flex-col gap-2">
                {view.subtasks.map((subtask) => (
                  <SubtaskItem
                    key={subtask.id}
                    subtask={subtask}
                    readOnly={readOnly}
                    onChange={onSubtaskChange}
                  />
                ))}
              </div>
            </Section>
          )}

          {view.photos.length > 0 && (
            <Section label={t("tasks.card.photos")}>
              <TaskPhotoGrid photos={view.photos} />
            </Section>
          )}

          {view.files.length > 0 && (
            <Section label={t("tasks.card.files")}>
              <div className="flex flex-col gap-2">
                {view.files.map((file) => (
                  <TaskFileItem
                    key={file.id}
                    file={file}
                    onDownload={(id) => {
                      const raw = task.files.find((f) => String(f.id) === id);
                      if (raw) window.open(raw.url, "_blank", "noopener,noreferrer");
                    }}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </CusDrawer>
  );
}
