import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type React from "react";
import { Drawer } from "@chakra-ui/react";
import type { DateValue } from "@ark-ui/react/date-picker";
import { LuCalendar, LuClock, LuMic, LuPlus, LuType, LuX } from "react-icons/lu";
import { IoFlagSharp } from "react-icons/io5";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusTimepicker } from "@/components/ui/calendar/CusTimepicker";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import type { RawTask } from "@/api/tasks/tasks.types";
import { StepIndicator } from "./components/StepIndicator";
import { VoiceNoteRecorder, type VoiceNoteValue } from "./components/VoiceNoteRecorder";
import { AssigneeChecklist } from "./components/AssigneeChecklist";
import type { TaskModalAddSubtask, TaskPriority } from "./TaskModalAdd";

export interface ExistingTaskFile {
  id: string;
  name: string;
  sizeLabel: string;
}

export interface TaskModalEditValues {
  title: string;
  descriptionMode: "text" | "voice";
  /** `descriptionMode === "text"` bo'lganda — doim yuboriladi (bo'sh bo'lsa ham). */
  description: string;
  /** Yangidan yozib olingan audio — faqat foydalanuvchi qayta yozganda beriladi. */
  descriptionAudio?: VoiceNoteValue;
  /** Mavjud audio izoh o'chirilgan, o'rniga yangisi yozilmagan bo'lsa — true. */
  audioRemoved: boolean;
  /** `audioRemoved` bo'lsa — o'chirilgan audio faylning id'si (`taskFilesApi.remove`ga beriladi). */
  removedAudioFileId: string | null;
  dueDateLabel: string;
  dueAt: string | null;
  assignees: TaskCardMember[];
  priority: TaskPriority;
  subtasks: TaskModalAddSubtask[];
  newFiles: { id: string; name: string; sizeLabel: string; file: File }[];
  removedFileIds: string[];
}

interface TaskModalEditProps {
  open: boolean;
  onClose: () => void;
  task: RawTask | null;
  members: TaskCardMember[];
  isLoadingMembers?: boolean;
  onSubmit: (values: TaskModalEditValues) => void | Promise<void>;
}

const QUICK_TIMES = ["09:00", "12:00", "15:00", "18:00", "21:00"];

const DUE_SECTION_LABEL = {
  quick: "tasks.modal.dueToday",
  custom: "tasks.modal.dueDeadline",
} as const;

const PRIORITY_OPTIONS: { value: TaskPriority; labelKey: `common.priority.${TaskPriority}`; activeColor: string }[] = [
  { value: "high", labelKey: "common.priority.high", activeColor: "var(--status-error-solid)" },
  { value: "medium", labelKey: "common.priority.medium", activeColor: "var(--accent-orange)" },
  { value: "low", labelKey: "common.priority.low", activeColor: "var(--text-secondary)" },
];

const PRIORITY_ICON = <IoFlagSharp size={14} />;

function IconToggle({
  icon,
  active,
  ariaLabel,
  onClick,
}: {
  icon: React.ReactNode;
  active: boolean;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-full"
      style={
        active
          ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
          : { color: "var(--text-secondary)" }
      }
    >
      {icon}
    </button>
  );
}

function Pill({
  label,
  icon,
  active,
  disabled,
  activeColor = "var(--brand-default)",
  className,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  activeColor?: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <CusButton
      variant="outline"
      size="sm"
      rounded="9999px"
      isDisabled={disabled}
      leftIcon={icon}
      className={className}
      style={
        active
          ? { background: activeColor, borderColor: activeColor, color: "var(--text-on-brand)" }
          : { borderColor: "var(--border-default)", color: "var(--text-secondary)" }
      }
      onClick={onClick}
    >
      {label}
    </CusButton>
  );
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDateDDMMYYYY(date: Date): string {
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()}`;
}

function formatDateValue(v: DateValue): string {
  return `${pad2(v.day)}.${pad2(v.month)}.${v.year}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** BUGUNLIK vaqtlari doim bugungi kun uchun — soat allaqachon o'tib ketgan bo'lsa tanlab bo'lmasin. */
function isPastQuickTime(time: string): boolean {
  const [hh, mm] = time.split(":").map(Number);
  const target = new Date();
  target.setHours(hh, mm, 0, 0);
  return target.getTime() <= Date.now();
}

function TaskModalEdit({
  open,
  onClose,
  task,
  members,
  isLoadingMembers,
  onSubmit,
}: TaskModalEditProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);

  // ── Step 1 ──────────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [descriptionMode, setDescriptionMode] = useState<"text" | "voice">("text");
  const [description, setDescription] = useState("");
  const [voiceNote, setVoiceNote] = useState<VoiceNoteValue | null>(null);
  const [audioTouched, setAudioTouched] = useState(false);
  const [existingAudioFileId, setExistingAudioFileId] = useState<string | null>(null);
  const [dueMode, setDueMode] = useState<"quick" | "custom">("quick");
  const [quickTime, setQuickTime] = useState(QUICK_TIMES[0]);
  const [isCustomQuickTime, setIsCustomQuickTime] = useState(false);
  const [customDate, setCustomDate] = useState<DateValue[] | undefined>();
  const [customTime, setCustomTime] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [priority, setPriority] = useState<TaskPriority>("medium");

  // ── Step 2 ──────────────────────────────────────────────────────────────────
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<TaskModalAddSubtask[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingTaskFile[]>([]);
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drawer unmountOnExit bo'lsa ham parentda doim mount holatda qoladi —
  // har safar ochilganda (yoki tahrirlanayotgan task almashganda) forma shu
  // taskning joriy qiymatlariga qayta sinxronlanadi.
  useEffect(() => {
    if (!open || !task) return;
    setStep(1);
    setTitle(task.title);
    const isAudio = task.description_type === "audio";
    setDescriptionMode(isAudio ? "voice" : "text");
    setDescription(isAudio ? "" : (task.description ?? ""));
    const audioFile = task.files.find((f) => f.kind === "description_audio");
    setVoiceNote(
      isAudio && audioFile
        ? { url: audioFile.url, durationLabel: "0:00", blob: new Blob() }
        : null,
    );
    setAudioTouched(false);
    setExistingAudioFileId(isAudio && audioFile ? String(audioFile.id) : null);

    const due = task.due_at ? new Date(task.due_at) : null;
    setDueMode(due ? "custom" : "quick");
    const firstAvailableQuickTime = QUICK_TIMES.find((t) => !isPastQuickTime(t));
    setQuickTime(firstAvailableQuickTime ?? QUICK_TIMES[0]);
    setIsCustomQuickTime(!firstAvailableQuickTime);
    setCustomDate(
      due
        ? [{ year: due.getFullYear(), month: due.getMonth() + 1, day: due.getDate() } as DateValue]
        : undefined,
    );
    setCustomTime(due ? `${pad2(due.getHours())}:${pad2(due.getMinutes())}` : "");

    setAssigneeIds(task.members.map((m) => String(m.user_id)));
    setPriority(task.priority);

    setSubtaskInput("");
    setSubtasks(
      task.subtasks.map((s) => ({ id: String(s.id), label: s.name, checked: s.checked })),
    );
    setExistingFiles(
      task.files
        .filter((f) => f.kind === "attachment")
        .map((f) => ({ id: String(f.id), name: f.file_name, sizeLabel: formatBytes(f.size_bytes) })),
    );
    setRemovedFileIds([]);
    setNewFiles([]);
    setIsSubmitting(false);
  }, [open, task]);

  const selectedAssignees = members.filter((m) => assigneeIds.includes(m.id));
  const activeDueIcon: "custom" | "quick" = dueMode === "custom" ? "custom" : "quick";

  const todayMinTime = (() => {
    const now = new Date();
    return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  })();

  const customMinTime = (() => {
    const target = customDate?.[customDate.length - 1];
    if (!target) return undefined;
    const now = new Date();
    const isToday =
      target.year === now.getFullYear() &&
      target.month === now.getMonth() + 1 &&
      target.day === now.getDate();
    if (!isToday) return undefined;
    return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  })();

  const dueDateLabel = (() => {
    if (dueMode === "quick") return `${formatDateDDMMYYYY(new Date())} ${quickTime}`;
    if (!customDate?.[0]) return "";
    const datePart =
      customDate.length > 1
        ? `${formatDateValue(customDate[0])} - ${formatDateValue(customDate[customDate.length - 1])}`
        : formatDateValue(customDate[0]);
    return `${datePart} ${customTime || "00:00"}`;
  })();

  function toggleAssignee(id: string) {
    setAssigneeIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function handleVoiceChange(value: VoiceNoteValue | null) {
    setAudioTouched(true);
    setVoiceNote(value);
  }

  function addSubtask() {
    const label = subtaskInput.trim();
    if (!label) return;
    setSubtasks((prev) => [...prev, { id: `st${Date.now()}`, label, checked: false }]);
    setSubtaskInput("");
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  function removeExistingFile(id: string) {
    setExistingFiles((prev) => prev.filter((f) => f.id !== id));
    setRemovedFileIds((prev) => [...prev, id]);
  }

  function handleClose() {
    if (isSubmitting) return;
    setStep(1);
    onClose();
  }

  function buildDueAt(): string | null {
    if (dueMode === "quick") {
      const [hh, mm] = quickTime.split(":").map(Number);
      const d = new Date();
      d.setHours(hh, mm, 0, 0);
      return d.toISOString();
    }
    if (!customDate?.[0]) return null;
    const v = customDate[customDate.length - 1];
    const [hh, mm] = (customTime || "00:00").split(":").map(Number);
    return new Date(v.year, v.month - 1, v.day, hh, mm, 0, 0).toISOString();
  }

  async function handleSubmit() {
    if (isSubmitting || !task) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        descriptionMode,
        description: description.trim(),
        descriptionAudio: descriptionMode === "voice" && audioTouched && voiceNote ? voiceNote : undefined,
        audioRemoved: descriptionMode === "voice" && audioTouched && !voiceNote,
        removedAudioFileId:
          descriptionMode === "voice" && audioTouched && !voiceNote ? existingAudioFileId : null,
        dueDateLabel,
        dueAt: buildDueAt(),
        assignees: selectedAssignees,
        priority,
        subtasks,
        newFiles: newFiles.map((f) => ({
          id: `${f.name}-${f.size}`,
          name: f.name,
          sizeLabel: formatBytes(f.size),
          file: f,
        })),
        removedFileIds,
      });
      setStep(1);
      onClose();
    } catch {
      // Xato bo'lsa drawer ochiq qoladi — xabar chaqiruvchi tomonda (toast) ko'rsatiladi.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CusDrawer
      open={open}
      onClose={handleClose}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      title={t("tasks.modal.titleEdit")}
      footer={
        step === 1 ? (
          <>
            <Drawer.ActionTrigger asChild>
              <CusButton variant="outline" className="flex-1">
                {t("common.actions.cancel")}
              </CusButton>
            </Drawer.ActionTrigger>
            <CusButton
              className="flex-1"
              isDisabled={!title.trim() || assigneeIds.length === 0}
              onClick={() => setStep(2)}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              {t("common.actions.next")}
            </CusButton>
          </>
        ) : (
          <>
            <CusButton
              variant="outline"
              className="flex-1"
              isDisabled={isSubmitting}
              onClick={() => setStep(1)}
            >
              {t("common.actions.back")}
            </CusButton>
            <CusButton
              className="flex-1"
              isLoading={isSubmitting}
              loadingText={t("common.states.sending")}
              onClick={handleSubmit}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              {t("common.actions.save")}
            </CusButton>
          </>
        )
      }
    >
      <StepIndicator step={step} />

      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <CusInput
            label={t("tasks.modal.nameLabel")}
            isRequired
            placeholder={t("tasks.modal.namePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                {t("tasks.modal.description")}
              </span>
              <div className="flex gap-1 rounded-full border border-default bg-surface p-1">
                <button
                  type="button"
                  aria-label={t("tasks.modal.descriptionText")}
                  onClick={() => setDescriptionMode("text")}
                  className="flex size-9 items-center justify-center rounded-full"
                  style={
                    descriptionMode === "text"
                      ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  <LuType size={16} />
                </button>
                <button
                  type="button"
                  aria-label={t("tasks.modal.descriptionVoice")}
                  onClick={() => setDescriptionMode("voice")}
                  className="flex size-9 items-center justify-center rounded-full"
                  style={
                    descriptionMode === "voice"
                      ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  <LuMic size={16} />
                </button>
              </div>
            </div>
            {descriptionMode === "text" ? (
              <CusTextArea
                placeholder={t("tasks.modal.descriptionPlaceholder")}
                autoresize
                maxH="10lh"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <VoiceNoteRecorder value={voiceNote} onChange={handleVoiceChange} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                {t(DUE_SECTION_LABEL[activeDueIcon])}
              </span>
              <div className="flex gap-1 rounded-full border border-default bg-surface p-1">
                <IconToggle
                  icon={<LuCalendar size={16} />}
                  ariaLabel={t("tasks.modal.pickDate")}
                  active={activeDueIcon === "custom"}
                  onClick={() => setDueMode("custom")}
                />
                <IconToggle
                  icon={<LuClock size={16} />}
                  ariaLabel={t("tasks.modal.quickTime")}
                  active={activeDueIcon === "quick"}
                  onClick={() => setDueMode("quick")}
                />
              </div>
            </div>
            {activeDueIcon === "quick" && (
              <>
                <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5">
                  <Pill
                    label={t("tasks.modal.customTime")}
                    className="flex-none"
                    active={isCustomQuickTime}
                    onClick={() => setIsCustomQuickTime(true)}
                  />
                  {[...QUICK_TIMES]
                    .sort((a, b) => Number(isPastQuickTime(a)) - Number(isPastQuickTime(b)))
                    .map((time) => (
                      <Pill
                        key={time}
                        label={time}
                        className="flex-none"
                        active={!isCustomQuickTime && quickTime === time}
                        disabled={isPastQuickTime(time)}
                        onClick={() => {
                          setIsCustomQuickTime(false);
                          setQuickTime(time);
                        }}
                      />
                    ))}
                </div>
                {isCustomQuickTime && (
                  <CusTimepicker
                    placeholder={t("ui.timepicker.placeholder")}
                    value={quickTime}
                    onChange={setQuickTime}
                    variant="modal"
                    modalTitle={t("tasks.modal.pickTimeTitle")}
                    minTime={todayMinTime}
                  />
                )}
              </>
            )}
            {dueMode === "custom" && (
              <div className="flex flex-col gap-2 pt-1">
                <CusCalendar
                  placeholder={t("tasks.modal.datePlaceholder")}
                  value={customDate}
                  onValueChange={(details) => setCustomDate(details.value)}
                  variant="modal"
                  modalTitle={t("tasks.modal.pickDateTitle")}
                />
                <CusTimepicker
                  label={t("tasks.modal.time")}
                  placeholder={t("ui.timepicker.placeholder")}
                  value={customTime}
                  onChange={setCustomTime}
                  variant="modal"
                  modalTitle={t("tasks.modal.pickTimeTitle")}
                  minTime={customMinTime}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              Сотрудники <span style={{ color: "var(--status-error-text)" }}>*</span>
            </span>
            <AssigneeChecklist
              members={members}
              selectedIds={assigneeIds}
              onToggle={toggleAssignee}
              isLoading={isLoadingMembers}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              {t("tasks.modal.priority")}
            </span>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <Pill
                  key={p.value}
                  label={t(p.labelKey)}
                  icon={PRIORITY_ICON}
                  active={priority === p.value}
                  activeColor={p.activeColor}
                  className="flex-1"
                  onClick={() => setPriority(p.value)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              {t("tasks.modal.subtasks")}
            </span>
            <div className="flex gap-2">
              <CusInput
                placeholder={t("tasks.modal.subtaskPlaceholder")}
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubtask();
                  }
                }}
              />
              <CusButton
                variant="outline"
                onClick={addSubtask}
                style={{ borderColor: "var(--brand-default)", color: "var(--brand-default)" }}
              >
                <LuPlus size={16} />
              </CusButton>
            </div>
            {subtasks.length > 0 && (
              <div className="flex flex-col gap-2">
                {subtasks.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 rounded-input border border-subtle bg-surface px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-primary">{s.label}</span>
                    <button
                      type="button"
                      aria-label={t("common.actions.delete")}
                      onClick={() => removeSubtask(s.id)}
                      className="flex-none text-secondary"
                    >
                      <LuX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              {t("tasks.modal.files")}
            </span>
            {existingFiles.length > 0 && (
              <div className="flex flex-col gap-2">
                {existingFiles.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 rounded-input border border-subtle bg-surface px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-primary">{f.name}</p>
                      <p className="text-xs text-secondary">{f.sizeLabel}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={t("common.actions.delete")}
                      onClick={() => removeExistingFile(f.id)}
                      className="flex-none text-secondary"
                    >
                      <LuX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <CusFileUpload
              variant="button"
              maxFiles={5}
              buttonText={t("common.actions.attachFile")}
              onFileChange={setNewFiles}
            />
          </div>

          <div className="flex flex-col divide-y divide-[var(--border-default)] rounded-input border border-subtle bg-surface px-4">
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-secondary">{t("tasks.modal.summaryTask")}</span>
              <span className="min-w-0 max-w-[60%] truncate font-medium text-primary">
                {title || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-secondary">{t("tasks.modal.summaryDue")}</span>
              <span className="font-medium text-primary">{dueDateLabel || "-"}</span>
            </div>
          </div>
        </div>
      )}
    </CusDrawer>
  );
}

export default TaskModalEdit;
