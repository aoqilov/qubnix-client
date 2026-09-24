import { AnimatePresence, motion } from "framer-motion";
import {
  LuChevronDown,
  LuPaperclip,
  LuPencil,
  LuRepeat2,
  LuSquareCheck,
  LuTrash2,
} from "react-icons/lu";
import { IoFlagSharp } from "react-icons/io5";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSwitch } from "@/components/ui/inputs/CusSwitch";
import {
  CAPTION_STYLE,
  PRIORITY_FLAG_COLOR,
  SectionLabel,
  type TaskCardPriority,
} from "@/components/shared/task-card/TaskCard";
import TaskAvatarGroup, {
  type TaskCardMember,
} from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import TaskMetaBadge from "@/components/shared/task-card/mini-components/TaskMetaBadge";
import SubtaskItem, {
  type TaskCardSubtask,
} from "@/components/shared/task-card/mini-components/SubtaskItem";
import TaskPhotoGrid, {
  type TaskCardPhoto,
} from "@/components/shared/task-card/mini-components/TaskPhotoGrid";
import TaskFileItem, {
  type TaskCardFile,
} from "@/components/shared/task-card/mini-components/TaskFileItem";
import TaskAudioMessage, {
  type TaskCardAudio,
} from "@/components/shared/task-card/mini-components/TaskAudioMessage";

interface TaskCardRoutineProps {
  title: string;
  projectLabel: string;
  priority?: TaskCardPriority;

  active: boolean;
  onToggleActive: (active: boolean) => void;

  /** Masalan "Каждый день 09:00" — kunlik/haftalik/oylik/yillik matnini chaqiruvchi tayyorlaydi. */
  repeatLabel: string;
  /** Masalan "Следующее завтра в 09:00". */
  nextRunLabel: string;
  /** Takrorlanish badge'i bosilganda — jadval tafsilotini ochish uchun. */
  onRepeatClick?: () => void;

  members: TaskCardMember[];
  overflowCount?: number;

  expanded: boolean;
  onToggleExpanded: () => void;

  // Faqat expanded holatda ishlatiladi:
  description?: string;
  /** Berilsa, matnli description o'rniga ovozli xabar ko'rsatiladi. */
  descriptionAudio?: TaskCardAudio;
  /** Shablon subtasklari — faqat ko'rsatiladi, belgilab bo'lmaydi. */
  subtasks?: TaskCardSubtask[];
  photos?: TaskCardPhoto[];
  files?: TaskCardFile[];
  onDownloadFile?: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function TaskCardRoutine({
  title,
  projectLabel,
  priority,
  active,
  onToggleActive,
  repeatLabel,
  nextRunLabel,
  onRepeatClick,
  members,
  overflowCount,
  expanded,
  onToggleExpanded,
  description,
  descriptionAudio,
  subtasks,
  photos,
  files,
  onDownloadFile,
  onEdit,
  onDelete,
}: TaskCardRoutineProps) {
  const subtaskCount = subtasks?.length ?? 0;
  const attachmentCount = (photos?.length ?? 0) + (files?.length ?? 0);

  return (
    <CusCardbox className="flex flex-col gap-3 rounded-input">
      {/* Header */}
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={expanded ? undefined : "line-clamp-2"}
            style={{
              color: "var(--text-primary)",
              fontSize: "var(--text-body, 16px)",
              fontWeight: 600,
            }}
          >
            {title}
          </span>
          <span className="truncate" style={CAPTION_STYLE}>
            {projectLabel}
          </span>
        </div>

        {/* Switch tepada, prioritet bayrog'i va chevron uning ostida. CusSwitch
        ichidagi Field.Root width:100% oladi — flex-none wrapper uni tarkib
        o'lchamiga qisqartiradi, shu bilan o'ng chetga yopishadi. */}
        <div className="flex flex-none flex-col items-end gap-2">
          <div className="flex-none">
            <CusSwitch checked={active} onCheckedChange={onToggleActive} />
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: PRIORITY_FLAG_COLOR[priority ?? "low"] }}>
              <IoFlagSharp size={16} />
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
      </div>

      {/* Takrorlanish + keyingi ishga tushish + subtask/file badge'lar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onRepeatClick}
          disabled={!onRepeatClick}
          className="min-w-0 rounded-chip transition-[transform,opacity] duration-150 hover:opacity-80 active:scale-95 disabled:pointer-events-none"
        >
          <TaskMetaBadge
            icon={<LuRepeat2 size={14} />}
            label={repeatLabel}
            bg="var(--bg-surface-secondary)"
          />
        </button>
        <div className="flex items-center gap-2">
          {subtaskCount > 0 && (
            <TaskMetaBadge
              icon={<LuSquareCheck size={14} />}
              label={String(subtaskCount)}
              bg="color-mix(in srgb, var(--accent-orange) 16%, transparent)"
            />
          )}
          {attachmentCount > 0 && (
            <TaskMetaBadge
              icon={<LuPaperclip size={14} />}
              label={String(attachmentCount)}
              bg="var(--status-error-bg)"
            />
          )}
        </div>
      </div>

      <span style={CAPTION_STYLE}>{nextRunLabel}</span>

      {/* Avatarlar */}
      <TaskAvatarGroup members={members} overflowCount={overflowCount} />

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
                      color: "var(--text-secondary)",
                      fontSize: "var(--text-body, 16px)",
                      fontWeight: 400,
                    }}
                  >
                    {description}
                  </p>
                )
              )}

              {subtasks && subtasks.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <SectionLabel>Подзадачи</SectionLabel>
                    <span style={CAPTION_STYLE}>{subtasks.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {subtasks.map((subtask) => (
                      <SubtaskItem key={subtask.id} subtask={subtask} readOnly />
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
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tugmalar — doim ko'rinadi */}
      <div className="flex gap-2">
        <CusButton
          variant="outline"
          colorPalette="red"
          size="sm"
          rounded="9999px"
          className="flex-1"
          leftIcon={<LuTrash2 size={14} />}
          onClick={onDelete}
        >
          Удалить
        </CusButton>
        <CusButton
          size="sm"
          rounded="9999px"
          className="flex-1"
          leftIcon={<LuPencil size={14} />}
          onClick={onEdit}
          style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
        >
          Изменить
        </CusButton>
      </div>
    </CusCardbox>
  );
}

export default TaskCardRoutine;
