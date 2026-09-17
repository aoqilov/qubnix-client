import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuFlag,
  LuChevronDown,
  LuClock,
  LuSquareCheck,
  LuPaperclip,
  LuTrash2,
  LuPencil,
} from "react-icons/lu";
import { FaRightLeft } from "react-icons/fa6";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import TaskCheckbox from "./mini-components/TaskCheckbox";
import TaskMetaBadge from "./mini-components/TaskMetaBadge";
import TaskAvatarGroup, { type TaskCardMember } from "./mini-components/TaskAvatarGroup";
import TaskStatusLabel, { type TaskStatusColor } from "./mini-components/TaskStatusLabel";
import TaskProjectTag from "./mini-components/TaskProjectTag";
import SubtaskItem, { type TaskCardSubtask } from "./mini-components/SubtaskItem";
import TaskPhotoGrid, { type TaskCardPhoto } from "./mini-components/TaskPhotoGrid";
import TaskFileItem, { type TaskCardFile } from "./mini-components/TaskFileItem";
import TaskAudioMessage, { type TaskCardAudio } from "./mini-components/TaskAudioMessage";

const CAPTION_STYLE = {
  color: "var(--text-secondary, #64748B)",
  fontSize: "var(--text-caption, 12px)",
  fontWeight: 500,
} as const;

export interface TaskCardStatusOption {
  id: string;
  label: string;
  icon: ReactNode;
  iconColor?: string;
}

interface TaskCardProps {
  title: string;
  flagged?: boolean;

  statusOptions: TaskCardStatusOption[];
  statusId: string;
  onStatusChange: (id: string) => void;

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
  /** Berilsa, matnli description o'rniga ovozli xabar (Telegram uslubida) ko'rsatiladi. */
  descriptionAudio?: TaskCardAudio;
  projectTag?: string;
  subtasks?: TaskCardSubtask[];
  onSubtaskChange?: (id: string, checked: boolean) => void;
  photos?: TaskCardPhoto[];
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
  flagged,
  statusOptions,
  statusId,
  onStatusChange,
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
  descriptionAudio,
  projectTag,
  subtasks,
  onSubtaskChange,
  photos,
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
          <CusMenuList
            trigger={(open) => (
              <button
                type="button"
                className="flex flex-none items-center justify-center transition-transform duration-150 hover:scale-125 active:scale-90"
              >
                <span
                  className="flex items-center justify-center transition-transform duration-200 ease-out"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  {open ? (
                    <FaRightLeft size={13} color="var(--brand-default)" />
                  ) : (
                    <TaskCheckbox color={statusColor} />
                  )}
                </span>
              </button>
            )}
            items={statusOptions.map((opt) => ({
              value: opt.id,
              label: opt.label,
              icon: opt.icon,
              iconColor: opt.iconColor,
            }))}
            value={statusId}
            onValueChange={onStatusChange}
            width={180}
          />
          <span
            className={expanded ? undefined : "line-clamp-2"}
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
          <span className="text-secondary">
            <LuFlag size={16} fill={flagged ? "currentColor" : "none"} />
          </span>
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
      <div className="flex items-center gap-2">
        <TaskAvatarGroup members={members} overflowCount={overflowCount} />
        <TaskStatusLabel label={statusLabel} color={statusColor} withBg />
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-4 pt-1">
              {descriptionAudio ? (
                <TaskAudioMessage audio={descriptionAudio} />
              ) : (
                description && (
                  <p
                    style={{
                      color: "var(--text-secondary, #64748B)",
                      fontSize: "var(--text-body, 16px)",
                      fontWeight: 400,
                    }}
                  >
                    {description}
                  </p>
                )
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
                  <TaskPhotoGrid photos={photos} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </CusCardbox>
  );
}

export default TaskCard;
