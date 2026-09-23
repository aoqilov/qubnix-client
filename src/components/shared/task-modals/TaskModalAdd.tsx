import { useEffect, useState } from "react";
import type React from "react";
import { Drawer } from "@chakra-ui/react";
import type { DateValue } from "@ark-ui/react/date-picker";
import {
  LuCalendar,
  LuClock,
  LuMic,
  LuPlus,
  LuType,
  LuX,
} from "react-icons/lu";
import { IoFlagSharp } from "react-icons/io5";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusTimepicker } from "@/components/ui/calendar/CusTimepicker";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import { StepIndicator } from "./components/StepIndicator";
import {
  VoiceNoteRecorder,
  type VoiceNoteValue,
} from "./components/VoiceNoteRecorder";
import { AssigneeChecklist } from "./components/AssigneeChecklist";

export type TaskPriority = "high" | "medium" | "low";

export interface TaskModalAddSubtask {
  id: string;
  label: string;
  checked: boolean;
}

export interface TaskModalAddFile {
  id: string;
  name: string;
  sizeLabel: string;
  /** Backend'ga yuklash uchun — `taskFilesApi.upload`ga beriladi. */
  file: File;
}

export interface TaskModalAddValues {
  title: string;
  description: string;
  descriptionAudio?: VoiceNoteValue;
  /** Formatlangan sana+vaqt, masalan "02.09.2026 09:00" — muddatsiz bo'lsa "". */
  dueDateLabel: string;
  /** ISO datetime — muddatsiz bo'lsa null. */
  dueAt: string | null;
  assignees: TaskCardMember[];
  priority: TaskPriority;
  subtasks: TaskModalAddSubtask[];
  files: TaskModalAddFile[];
}

interface TaskModalAddProps {
  open: boolean;
  onClose: () => void;
  /** Promise qaytarsa, drawer u tugaguncha (success bo'lguncha) yopilmaydi va "Готово" spinner ko'rsatadi. Xato tashlansa (`throw`) — drawer ochiq qoladi. */
  onSubmit: (values: TaskModalAddValues) => void | Promise<void>;
  members: TaskCardMember[];
  isLoadingMembers?: boolean;
}

const QUICK_TIMES = ["09:00", "12:00", "15:00", "18:00", "21:00"];

const DUE_SECTION_LABEL: Record<"quick" | "custom", string> = {
  quick: "Bugunlik",
  custom: "Kelajak kunlari",
};

const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  activeColor: string;
}[] = [
  { value: "high", label: "Высокий", activeColor: "var(--status-error-solid)" },
  { value: "medium", label: "Средний", activeColor: "var(--accent-orange)" },
  { value: "low", label: "Низкий", activeColor: "var(--text-secondary)" },
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
          ? {
              background: "var(--brand-default)",
              color: "var(--text-on-brand)",
            }
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
          ? {
              background: activeColor,
              borderColor: activeColor,
              color: "var(--text-on-brand)",
            }
          : {
              borderColor: "var(--border-default)",
              color: "var(--text-secondary)",
            }
      }
      onClick={onClick}
    >
      {label}
    </CusButton>
  );
}

function formatDateDDMMYYYY(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

function formatDateValue(v: DateValue): string {
  return `${String(v.day).padStart(2, "0")}.${String(v.month).padStart(2, "0")}.${v.year}`;
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

function TaskModalAdd({
  open,
  onClose,
  onSubmit,
  members,
  isLoadingMembers,
}: TaskModalAddProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // ── Step 1 ──────────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [descriptionMode, setDescriptionMode] = useState<"text" | "voice">(
    "text",
  );
  const [description, setDescription] = useState("");
  const [voiceNote, setVoiceNote] = useState<VoiceNoteValue | null>(null);
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
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drawer unmountOnExit bo'lsa ham, TaskModalAddning o'zi parentda doim mount
  // holatda qoladi — shuning uchun har safar ochilganda formani bo'sh holatga
  // qaytaramiz, aks holda oldingi to'ldirilgan ma'lumotlar qolib ketadi.
  useEffect(() => {
    if (!open) return;
    setStep(1);
    setTitle("");
    setDescriptionMode("text");
    setDescription("");
    setVoiceNote(null);
    setDueMode("quick");
    const firstAvailableQuickTime = QUICK_TIMES.find((t) => !isPastQuickTime(t));
    setQuickTime(firstAvailableQuickTime ?? QUICK_TIMES[0]);
    setIsCustomQuickTime(!firstAvailableQuickTime);
    setCustomDate(undefined);
    setCustomTime("");
    setAssigneeIds([]);
    setPriority("medium");
    setSubtaskInput("");
    setSubtasks([]);
    setFiles([]);
    setIsSubmitting(false);
  }, [open]);

  const selectedAssignees = members.filter((m) => assigneeIds.includes(m.id));
  const activeDueIcon: "custom" | "quick" = dueMode === "custom" ? "custom" : "quick";

  // "Bugunlik" bo'limi doim bugungi kun uchun — o'zi belgilashda ham o'tgan vaqt disabled bo'lsin.
  const todayMinTime = (() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  })();

  // Muddat oraliq oxiriga (yoki yagona sanaga) qo'yiladi — shu sana bugun bo'lsa,
  // vaqt tanlashda allaqachon o'tib ketgan soat/daqiqalar disabled bo'lishi kerak.
  const customMinTime = (() => {
    const target = customDate?.[customDate.length - 1];
    if (!target) return undefined;
    const now = new Date();
    const isToday =
      target.year === now.getFullYear() &&
      target.month === now.getMonth() + 1 &&
      target.day === now.getDate();
    if (!isToday) return undefined;
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  })();

  const dueDateLabel = (() => {
    if (dueMode === "quick")
      return `${formatDateDDMMYYYY(new Date())} ${quickTime}`;
    if (!customDate?.[0]) return "";
    const datePart =
      customDate.length > 1
        ? `${formatDateValue(customDate[0])} - ${formatDateValue(customDate[customDate.length - 1])}`
        : formatDateValue(customDate[0]);
    return `${datePart} ${customTime || "00:00"}`;
  })();

  const assigneeSummary = (() => {
    if (selectedAssignees.length === 0) return "-";
    const [first, ...rest] = selectedAssignees;
    const parts = first.name.trim().split(/\s+/);
    const short =
      parts.length >= 2
        ? `${parts[parts.length - 1]} ${parts[0].charAt(0).toUpperCase()}.`
        : first.name;
    return rest.length > 0 ? `${short} +${rest.length}` : short;
  })();

  function toggleAssignee(id: string) {
    setAssigneeIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  }

  function addSubtask() {
    const label = subtaskInput.trim();
    if (!label) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st${Date.now()}`, label, checked: false },
    ]);
    setSubtaskInput("");
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  function handleClose() {
    // Submit tugab (success/xato) yopilguncha drawer yopilmasin.
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
    // Oraliq (range) tanlangan bo'lsa — muddat oraliq oxiriga qo'yiladi.
    const v = customDate[customDate.length - 1];
    const [hh, mm] = (customTime || "00:00").split(":").map(Number);
    return new Date(v.year, v.month - 1, v.day, hh, mm, 0, 0).toISOString();
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        descriptionAudio: voiceNote ?? undefined,
        dueDateLabel,
        dueAt: buildDueAt(),
        assignees: selectedAssignees,
        priority,
        subtasks,
        files: files.map((f) => ({
          id: `${f.name}-${f.size}`,
          name: f.name,
          sizeLabel: formatBytes(f.size),
          file: f,
        })),
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
      title="Yangi vazifa"
      footer={
        step === 1 ? (
          <>
            <Drawer.ActionTrigger asChild>
              <CusButton variant="outline" className="flex-1">
                Назад
              </CusButton>
            </Drawer.ActionTrigger>
            <CusButton
              className="flex-1"
              isDisabled={!title.trim() || assigneeIds.length === 0}
              onClick={() => setStep(2)}
              style={{
                background: "var(--brand-default)",
                color: "var(--text-on-brand)",
              }}
            >
              Далее
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
              Назад
            </CusButton>
            <CusButton
              className="flex-1"
              isLoading={isSubmitting}
              loadingText="Yuborilmoqda..."
              onClick={handleSubmit}
              style={{
                background: "var(--brand-default)",
                color: "var(--text-on-brand)",
              }}
            >
              Готово
            </CusButton>
          </>
        )
      }
    >
      <StepIndicator step={step} />

      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <CusInput
            label="Название задачи"
            isRequired
            placeholder="Напишите название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                Описание
              </span>
              <div className="flex gap-1 rounded-full border border-default bg-surface p-1">
                <button
                  type="button"
                  aria-label="Matn"
                  onClick={() => setDescriptionMode("text")}
                  className="flex size-9 items-center justify-center rounded-full"
                  style={
                    descriptionMode === "text"
                      ? {
                          background: "var(--brand-default)",
                          color: "var(--text-on-brand)",
                        }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  <LuType size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Ovoz"
                  onClick={() => setDescriptionMode("voice")}
                  className="flex size-9 items-center justify-center rounded-full"
                  style={
                    descriptionMode === "voice"
                      ? {
                          background: "var(--brand-default)",
                          color: "var(--text-on-brand)",
                        }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  <LuMic size={16} />
                </button>
              </div>
            </div>
            {descriptionMode === "text" ? (
              <CusTextArea
                placeholder="Vazifa haqida qisqacha ma'lumot"
                autoresize
                maxH="10lh"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <VoiceNoteRecorder value={voiceNote} onChange={setVoiceNote} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                {DUE_SECTION_LABEL[activeDueIcon]}
              </span>
              <div className="flex gap-1 rounded-full border border-default bg-surface p-1">
                <IconToggle
                  icon={<LuCalendar size={16} />}
                  ariaLabel="Sanani tanlash"
                  active={activeDueIcon === "custom"}
                  onClick={() => setDueMode("custom")}
                />
                <IconToggle
                  icon={<LuClock size={16} />}
                  ariaLabel="Tezkor vaqt tanlash"
                  active={activeDueIcon === "quick"}
                  onClick={() => setDueMode("quick")}
                />
              </div>
            </div>
            {activeDueIcon === "quick" && (
              <>
                <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5">
                  <Pill
                    label="O'zi belgilash"
                    className="flex-none"
                    active={isCustomQuickTime}
                    onClick={() => setIsCustomQuickTime(true)}
                  />
                  {[...QUICK_TIMES]
                    .sort((a, b) => Number(isPastQuickTime(a)) - Number(isPastQuickTime(b)))
                    .map((t) => (
                      <Pill
                        key={t}
                        label={t}
                        className="flex-none"
                        active={!isCustomQuickTime && quickTime === t}
                        disabled={isPastQuickTime(t)}
                        onClick={() => {
                          setIsCustomQuickTime(false);
                          setQuickTime(t);
                        }}
                      />
                    ))}
                </div>
                {isCustomQuickTime && (
                  <CusTimepicker
                    placeholder="ЧЧ:ММ"
                    value={quickTime}
                    onChange={setQuickTime}
                    variant="modal"
                    modalTitle="Vaqtni tanlang"
                    minTime={todayMinTime}
                  />
                )}
              </>
            )}
            {dueMode === "custom" && (
              <div className="flex flex-col gap-2 pt-1">
                <CusCalendar
                  placeholder="Sana"
                  value={customDate}
                  onValueChange={(details) => setCustomDate(details.value)}
                  variant="modal"
                  modalTitle="Sanani tanlang"
                />
                <CusTimepicker
                  label="Vaqt"
                  placeholder="ЧЧ:ММ"
                  value={customTime}
                  onChange={setCustomTime}
                  variant="modal"
                  modalTitle="Vaqtni tanlang"
                  minTime={customMinTime}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              Сотрудники{" "}
              <span style={{ color: "var(--status-error-text)" }}>*</span>
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
              Приоритет
            </span>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <Pill
                  key={p.value}
                  label={p.label}
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
              Дополнительные задачи - sub-task
            </span>
            <div className="flex gap-2">
              <CusInput
                placeholder="Новый Sub-Task"
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
                style={{
                  borderColor: "var(--brand-default)",
                  color: "var(--brand-default)",
                }}
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
                    <span className="min-w-0 flex-1 truncate text-sm text-primary">
                      {s.label}
                    </span>
                    <button
                      type="button"
                      aria-label="O'chirish"
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

          <CusFileUpload
            variant="button"
            maxFiles={5}
            buttonText="Прикрепить файл"
            onFileChange={setFiles}
          />

          <div className="flex flex-col divide-y divide-[var(--border-default)] rounded-input border border-subtle bg-surface px-4">
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-secondary">Задача</span>
              <span className="min-w-0 max-w-[60%] truncate font-medium text-primary">
                {title || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-secondary">Ответственный</span>
              <span className="font-medium text-primary">
                {assigneeSummary}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-secondary">Сроки выполнения</span>
              <span className="font-medium text-primary">
                {dueDateLabel || "-"}
              </span>
            </div>
          </div>
        </div>
      )}
    </CusDrawer>
  );
}

export default TaskModalAdd;
