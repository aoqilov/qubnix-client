import type { ReactNode } from "react";
import {
  LuFlag,
  LuChevronDown,
  LuX,
  LuClock,
  LuSquareCheck,
  LuPaperclip,
  LuTrash2,
  LuPencil,
} from "react-icons/lu";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import TaskCheckbox from "./mini-components/TaskCheckbox";
import TaskMetaBadge from "./mini-components/TaskMetaBadge";
import TaskAvatarGroup, { type TaskCardMember } from "./mini-components/TaskAvatarGroup";
import TaskStatusLabel, { type TaskStatusColor } from "./mini-components/TaskStatusLabel";
import TaskProjectTag from "./mini-components/TaskProjectTag";
import SubtaskItem, { type TaskCardSubtask } from "./mini-components/SubtaskItem";
import TaskPhotoGrid, { type TaskCardPhoto } from "./mini-components/TaskPhotoGrid";
import TaskFileItem, { type TaskCardFile } from "./mini-components/TaskFileItem";

const CAPTION_STYLE = {
  color: "var(--text-secondary, #64748B)",
  fontSize: "var(--text-caption, 12px)",
  fontWeight: 500,
} as const;

interface TaskCardProps {
  title: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  flagged?: boolean;
  onFlagClick?: () => void;

  dateRangeLabel: string;
  subtaskCountLabel: string;
  fileCount: number;

  members: TaskCardMember[];
  overflowCount?: number;

  statusLabel: string;
  statusColor: TaskStatusColor;

  expanded: boolean;
  onToggleExpanded: () => void;

  // Faqat expanded holatda ishlatiladi:
  description?: string;
  projectTag?: string;
  subtasks?: TaskCardSubtask[];
  onSubtaskChange?: (id: string, checked: boolean) => void;
  photos?: TaskCardPhoto[];
  onAddPhoto?: () => void;
  files?: TaskCardFile[];
  onDownloadFile?: (id: string) => void;
  onAttachFile?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="uppercase tracking-wide" style={CAPTION_STYLE}>
      {children}
    </span>
  );
}

function TaskCard({
  title,
  checked,
  onCheckedChange,
  flagged,
  onFlagClick,
  dateRangeLabel,
  subtaskCountLabel,
  fileCount,
  members,
  overflowCount,
  statusLabel,
  statusColor,
  expanded,
  onToggleExpanded,
  description,
  projectTag,
  subtasks,
  onSubtaskChange,
  photos,
  onAddPhoto,
  files,
  onDownloadFile,
  onAttachFile,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const doneSubtasks = subtasks?.filter((s) => s.checked).length ?? 0;

  return (
    <CusCardbox className="flex flex-col gap-3 rounded-input">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {expanded ? (
            <button
              type="button"
              onClick={onToggleExpanded}
              className="flex flex-none items-center justify-center"
              style={{
                width: 20,
                height: 20,
                borderRadius: "var(--radius-avatar, 9999px)",
                border: "1.5px solid var(--status-error-solid, #F04438)",
              }}
            >
              <LuX size={12} color="var(--status-error-solid, #F04438)" />
            </button>
          ) : (
            <TaskCheckbox checked={checked} onChange={onCheckedChange} />
          )}
          <span
            className="truncate"
            style={{
              color: "var(--text-secondary, #64748B)",
              fontSize: "var(--text-body, 16px)",
              fontWeight: 500,
            }}
          >
            {title}
          </span>
        </div>

        <div className="flex flex-none items-center gap-2">
          <button type="button" onClick={onFlagClick} className="text-secondary hover:text-primary">
            <LuFlag size={16} fill={flagged ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={onToggleExpanded}
            className="text-secondary transition-transform hover:text-primary"
            style={{ transform: expanded ? "rotate(180deg)" : undefined }}
          >
            <LuChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Vaqt + subtask/file badge'lar */}
      <div className="flex items-center justify-between gap-2">
        <TaskMetaBadge
          icon={<LuClock size={14} />}
          label={dateRangeLabel}
          bg="var(--bg-surface-secondary, #E2E8F0)"
        />
        <div className="flex items-center gap-2">
          <TaskMetaBadge
            icon={<LuSquareCheck size={14} />}
            label={subtaskCountLabel}
            bg="var(--orange-subtle, #FFEDD5)"
          />
          <TaskMetaBadge
            icon={<LuPaperclip size={14} />}
            label={String(fileCount)}
            bg="var(--c-danger-50, #FFEDEC)"
          />
        </div>
      </div>

      {/* Avatarlar + status */}
      <div className="flex items-center justify-between gap-2">
        <TaskAvatarGroup members={members} overflowCount={overflowCount} />
        <TaskStatusLabel label={statusLabel} color={statusColor} withBg={expanded} />
      </div>

      {expanded && (
        <div className="flex flex-col gap-4">
          {description && (
            <p
              style={{
                color: "var(--text-secondary, #64748B)",
                fontSize: "var(--text-body, 16px)",
                fontWeight: 400,
              }}
            >
              {description}
            </p>
          )}

          {projectTag && (
            <div>
              <TaskProjectTag label={projectTag} />
            </div>
          )}

          {subtasks && subtasks.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <SectionLabel>Подзадачи</SectionLabel>
                <span style={CAPTION_STYLE}>
                  {doneSubtasks}/{subtasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {subtasks.map((subtask) => (
                  <SubtaskItem
                    key={subtask.id}
                    subtask={subtask}
                    onChange={(id, next) => onSubtaskChange?.(id, next)}
                  />
                ))}
              </div>
            </div>
          )}

          {photos && photos.length > 0 && (
            <div className="flex flex-col gap-2">
              <SectionLabel>Фото</SectionLabel>
              <TaskPhotoGrid photos={photos} onAdd={onAddPhoto} />
            </div>
          )}

          {files && files.length > 0 && (
            <div className="flex flex-col gap-2">
              <SectionLabel>Файлы</SectionLabel>
              <div className="flex flex-col gap-2">
                {files.map((file) => (
                  <TaskFileItem key={file.id} file={file} onDownload={onDownloadFile} />
                ))}
              </div>
              <button
                type="button"
                onClick={onAttachFile}
                className="flex items-center gap-1.5 self-start text-sm font-medium text-brand"
              >
                <LuPaperclip size={14} />
                Прикрепить файл
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <CusButton
              variant="outline"
              colorPalette="red"
              className="flex-1"
              leftIcon={<LuTrash2 size={16} />}
              onClick={onDelete}
            >
              Удалить
            </CusButton>
            <CusButton
              className="flex-1"
              leftIcon={<LuPencil size={16} />}
              onClick={onEdit}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              Изменить
            </CusButton>
          </div>
        </div>
      )}
    </CusCardbox>
  );
}

export default TaskCard;
