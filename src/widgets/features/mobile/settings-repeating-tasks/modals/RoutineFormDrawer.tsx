import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Drawer } from "@chakra-ui/react";
import axios from "axios";
import type { DateValue } from "@ark-ui/react/date-picker";
import { IoFlagSharp } from "react-icons/io5";
import { LuCalendar, LuPlus, LuX } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusTimepicker } from "@/components/ui/calendar/CusTimepicker";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import CusSelect from "@/components/ui/select/CusSelect";
import { AssigneeChecklist } from "@/components/shared/task-modals/components/AssigneeChecklist";
import { StepIndicator } from "@/components/shared/task-modals/components/StepIndicator";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import type { TaskPriority } from "@/api/tasks/tasks.types";
import type { RawTaskRoutine, RoutineFrequency } from "@/api/task-routines/task-routines.types";
import type { RawProjectMember } from "@/api/projects/projects.types";
import { todayApiDate } from "@/utils/apiDate";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useSessionStore } from "@/store/session.store";
import {
  useCreateRoutine,
  useProjectMembersForRoutine,
  useUpdateRoutine,
  useUploadRoutineFile,
} from "../hooks/useApiRepeatingTasks";
import { MONTH_DAYS, WEEKDAY_OPTIONS } from "../lib/routineSchedule";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

function toMemberCard(m: RawProjectMember): TaskCardMember {
  const name = `${m.first_name} ${m.last_name}`;
  return {
    id: String(m.user_id),
    name,
    initials: initialsOf(name),
    avatarUrl: m.telegram_avatar_url ?? undefined,
  };
}

function formatDay(v: DateValue): string {
  return `${String(v.day).padStart(2, "0")}.${String(v.month).padStart(2, "0")}.${v.year}`;
}

function toApiDate(v: DateValue): string {
  return `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`;
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string" && message) return message;
  }
  return "Amalni bajarib bo'lmadi. Qaytadan urinib ko'ring.";
}

const FREQUENCY_OPTIONS: { value: RoutineFrequency; label: string }[] = [
  { value: "daily", label: "Kunlik" },
  { value: "weekly", label: "Haftalik" },
  { value: "monthly", label: "Oylik" },
  { value: "yearly", label: "Yillik" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; activeColor: string }[] = [
  { value: "high", label: "Высокий", activeColor: "var(--status-error-solid)" },
  { value: "medium", label: "Средний", activeColor: "var(--accent-orange)" },
  { value: "low", label: "Низкий", activeColor: "var(--text-secondary)" },
];

function Pill({
  label,
  icon,
  active,
  activeColor = "var(--brand-default)",
  className,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  activeColor?: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <CusButton
      variant="outline"
      size="sm"
      rounded="9999px"
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

interface RoutineFormSubtask {
  id: string;
  label: string;
  /** Backend'dagi id — tahrirlashda mavjud subtaskni saqlab qolish uchun. */
  serverId?: number;
  checked?: boolean;
}

export interface RoutineFormInitial {
  projectId: string;
  routine: RawTaskRoutine;
}

interface RoutineFormDrawerProps {
  open: boolean;
  onClose: () => void;
  organizationId: string | null;
  projects: { id: string; name: string }[];
  /** Berilsa — tahrirlash rejimi (routine + qaysi loyihaga tegishliligi). */
  initial?: RoutineFormInitial | null;
  onError: (message: string) => void;
}

export function RoutineFormDrawer({
  open,
  onClose,
  organizationId,
  projects,
  initial,
  onError,
}: RoutineFormDrawerProps) {
  const isEditing = !!initial;

  const [step, setStep] = useState<1 | 2>(1);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<RoutineFrequency>("daily");
  const [time, setTime] = useState("09:00");
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [monthDays, setMonthDays] = useState<number[]>([]);
  const [isMonthDayPickerOpen, setIsMonthDayPickerOpen] = useState(false);
  const [yearlyDates, setYearlyDates] = useState<DateValue[]>([]);
  const [isYearlyPickerOpen, setIsYearlyPickerOpen] = useState(false);
  /** Majburiy, "HH:mm" — har bir yaratilgan vazifa shu soatgacha bajarilishi kerak. */
  const [endTime, setEndTime] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<RoutineFormSubtask[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const subtaskInputRef = useRef<HTMLInputElement>(null);

  // Ochilishdagi fokusni (nom maydoni) CusDrawer'ning initialFocusEl'i beradi;
  // 2-qadamga o'tilganda esa subtask maydoni fokus oladi.
  useEffect(() => {
    if (open && step === 2) subtaskInputRef.current?.focus();
  }, [open, step]);

  // Har safar ochilganda — tahrirlash bo'lsa mavjud routine bilan, aks holda bo'sh holat bilan to'ldiriladi.
  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSubtaskInput("");
    setFiles([]);
    if (initial) {
      const r = initial.routine;
      setSubtasks(
        r.subtasks.map((s) => ({
          id: `srv${s.id}`,
          label: s.name,
          serverId: s.id,
          checked: s.checked,
        })),
      );
      setProjectId(initial.projectId);
      setName(r.title);
      setDescription(r.description ?? "");
      setPriority(r.priority);
      setMemberIds(r.member_ids.map(String));
      setFrequency(r.frequency);
      setTime(r.time_of_day);
      setWeekdays(r.weekdays);
      setMonthDays(r.month_days);
      const [y, m, d] = r.start_date.split("-").map(Number);
      setYearlyDates([{ year: y, month: m, day: d } as DateValue]);
      setEndTime(r.end_time ?? "");
    } else {
      setSubtasks([]);
      setProjectId(projects[0]?.id ?? "");
      setName("");
      setDescription("");
      setPriority("medium");
      setMemberIds([]);
      setFrequency("daily");
      setTime("09:00");
      setWeekdays([]);
      setMonthDays([]);
      setYearlyDates([]);
      setEndTime("");
    }
    setIsSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  // Personal workspace — xodim tanlanmaydi, routine foydalanuvchining o'ziga biriktiriladi.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const currentUserId = useSessionStore((s) => s.user?.id);
  const { data: projectMembers, isPending: isMembersPending } = useProjectMembersForRoutine(
    organizationId,
    projectId,
    open && !isPersonal,
  );
  const members = (projectMembers ?? []).map(toMemberCard);

  const createRoutine = useCreateRoutine(organizationId);
  const updateRoutine = useUpdateRoutine(organizationId);
  const uploadFile = useUploadRoutineFile(organizationId);

  function toggleMember(id: string) {
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function toggleWeekday(day: number) {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((v) => v !== day) : [...prev, day]));
  }

  function toggleMonthDay(day: number) {
    setMonthDays((prev) =>
      prev.includes(day) ? prev.filter((v) => v !== day) : [...prev, day].sort((a, b) => a - b),
    );
  }

  function addSubtask() {
    // Plus bosilganda ham fokus inputda qoladi — keyingi bandni darhol yozish uchun.
    subtaskInputRef.current?.focus();
    const label = subtaskInput.trim();
    if (!label) return;
    setSubtasks((prev) => [...prev, { id: `st${Date.now()}`, label }]);
    setSubtaskInput("");
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  // "HH:mm" satrlari leksikografik solishtirishda ham to'g'ri tartiblanadi.
  const isEndTimeValid = !endTime || endTime > time;

  const canSubmit =
    !!endTime &&
    isEndTimeValid &&
    !!name.trim() &&
    !!projectId &&
    (frequency !== "weekly" || weekdays.length > 0) &&
    (frequency !== "monthly" || monthDays.length > 0) &&
    (frequency !== "yearly" || yearlyDates.length > 0);

  async function handleSubmit() {
    if (isSubmitting || !canSubmit || !projectId) return;
    setIsSubmitting(true);
    try {
      const targetProjectId = initial?.projectId ?? projectId;

      // Har bir routine o'z fayl nusxasini oladi — yillik rejimda bir nechta routine
      // yaratilganda bitta yuklangan fayl id'si ikki joyga biriktirilmaydi.
      const uploadFiles = async (): Promise<number[] | undefined> => {
        if (files.length === 0) return undefined;
        const uploads = await Promise.all(
          files.map((file) => uploadFile.mutateAsync({ projectId: targetProjectId, file })),
        );
        return uploads.flatMap((uploaded) => uploaded.map((f) => f.id));
      };

      const subtaskPayload = subtasks.map((s) => ({
        id: s.serverId,
        name: s.label,
        checked: s.checked,
      }));

      const basePayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        priority,
        members: isPersonal
          ? currentUserId
            ? [{ user_id: Number(currentUserId) }]
            : []
          : memberIds.map((id) => ({ user_id: Number(id) })),
        frequency,
        time,
        timezone: "Asia/Tashkent",
        weekdays: frequency === "weekly" ? weekdays : undefined,
        month_days: frequency === "monthly" ? monthDays : undefined,
        end_time: endTime,
        // Tahrirlashda bo'sh ro'yxat ham yuboriladi — hamma subtask o'chirilgan bo'lishi mumkin.
        subtasks: isEditing || subtaskPayload.length > 0 ? subtaskPayload : undefined,
      };

      if (isEditing && initial) {
        const startDate =
          frequency === "yearly" && yearlyDates[0] ? toApiDate(yearlyDates[0]) : todayApiDate();
        await updateRoutine.mutateAsync({
          projectId: initial.projectId,
          routineId: String(initial.routine.id),
          payload: { ...basePayload, start_date: startDate, file_ids: await uploadFiles() },
        });
      } else if (frequency === "yearly") {
        // Yillik uchun bir nechta kun tanlansa — har biri alohida routine
        // sifatida yaratiladi (backend'da bitta routine faqat bitta kun/oyni saqlaydi).
        for (const d of yearlyDates) {
          await createRoutine.mutateAsync({
            projectId,
            payload: { ...basePayload, start_date: toApiDate(d), file_ids: await uploadFiles() },
          });
        }
      } else {
        await createRoutine.mutateAsync({
          projectId,
          payload: { ...basePayload, start_date: todayApiDate(), file_ids: await uploadFiles() },
        });
      }
      onClose();
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CusDrawer
      open={open}
      onClose={() => {
        if (isSubmitting) return;
        onClose();
      }}
      placement="end"
      size="full"
      closeOnBackdrop={false}
      closeOnEscape={false}
      initialFocusEl={() => nameInputRef.current}
      title={isEditing ? "Vazifani tahrirlash" : "Yangi doimiy vazifa"}
      footer={
        step === 1 ? (
          <>
            <Drawer.ActionTrigger asChild>
              <CusButton variant="outline" className="flex-1" isDisabled={isSubmitting}>
                Bekor qilish
              </CusButton>
            </Drawer.ActionTrigger>
            <CusButton
              className="flex-1"
              isDisabled={!canSubmit}
              onClick={() => setStep(2)}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
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
              Orqaga
            </CusButton>
            <CusButton
              className="flex-1"
              isDisabled={!canSubmit}
              isLoading={isSubmitting}
              loadingText="Yuborilmoqda..."
              onClick={handleSubmit}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              Saqlash
            </CusButton>
          </>
        )
      }
    >
      <StepIndicator step={step} />

      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <CusSelect
            label="Loyiha"
            required
            disabled={isEditing}
            placeholder="Loyihani tanlang"
            options={projects.map((p) => ({ label: p.name, value: p.id }))}
            value={projectId}
            onChange={setProjectId}
          />

          <CusInput
            ref={nameInputRef}
            label="Vazifa nomi"
            isRequired
            placeholder="Masalan: Oylik hisobot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <CusTextArea
            label="Tavsif"
            placeholder="Ixtiyoriy"
            autoresize
            maxH="8lh"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              Takrorlanish
            </span>
            <div className="flex flex-wrap gap-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <Pill
                  key={opt.value}
                  label={opt.label}
                  active={frequency === opt.value}
                  onClick={() => setFrequency(opt.value)}
                />
              ))}
            </div>
          </div>

          {frequency === "weekly" && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                Hafta kunlari *
              </span>
              <div className="grid grid-cols-4 gap-2">
                {WEEKDAY_OPTIONS.map((opt) => (
                  <Pill
                    key={opt.value}
                    label={opt.label}
                    className="w-full"
                    active={weekdays.includes(opt.value)}
                    onClick={() => toggleWeekday(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                Oyning kuni *
              </span>
              <div
                onClick={() => setIsMonthDayPickerOpen(true)}
                className="flex h-10 w-full cursor-pointer items-center justify-between rounded-input border border-default bg-surface px-3"
                style={{ fontSize: 14 }}
              >
                <span
                  className="truncate"
                  style={{ color: monthDays.length ? "var(--text-primary)" : "var(--text-dim)" }}
                >
                  {monthDays.length === 0
                    ? "Kunlarni tanlang"
                    : monthDays.length <= 3
                      ? monthDays.map((d) => `${d}-sana`).join(", ")
                      : `${monthDays.length} ta kun tanlandi`}
                </span>
                <LuCalendar size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </div>

              <CusDialog
                open={isMonthDayPickerOpen}
                onClose={() => setIsMonthDayPickerOpen(false)}
                title="Oyning kunlarini tanlang"
                centered
                size="xs"
                footer={
                  <CusButton
                    className="w-full"
                    isDisabled={monthDays.length === 0}
                    onClick={() => setIsMonthDayPickerOpen(false)}
                    style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
                  >
                    Tasdiqlash
                  </CusButton>
                }
              >
                <div className="grid grid-cols-7 gap-2">
                  {MONTH_DAYS.map((d) => {
                    const active = monthDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleMonthDay(d)}
                        className="flex aspect-square items-center justify-center rounded-input text-sm font-semibold"
                        style={
                          active
                            ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
                            : {
                                background: "var(--bg-surface-secondary)",
                                color: "var(--text-primary)",
                              }
                        }
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </CusDialog>
            </div>
          )}

          {frequency === "yearly" && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                Yil kuni{isEditing ? "" : " (bir nechtasini tanlash mumkin)"} *
              </span>
              <div
                onClick={() => setIsYearlyPickerOpen(true)}
                className="flex h-10 w-full cursor-pointer items-center justify-between rounded-input border border-default bg-surface px-3"
                style={{ fontSize: 14 }}
              >
                <span
                  className="truncate"
                  style={{ color: yearlyDates.length ? "var(--text-primary)" : "var(--text-dim)" }}
                >
                  {yearlyDates.length === 0
                    ? "Sanalarni tanlang"
                    : yearlyDates.length <= 2
                      ? yearlyDates.map(formatDay).join(", ")
                      : `${yearlyDates.length} ta sana tanlandi`}
                </span>
                <LuCalendar size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </div>

              <CusDialog
                open={isYearlyPickerOpen}
                onClose={() => setIsYearlyPickerOpen(false)}
                title={isEditing ? "Sanani tanlang" : "Yil kunlarini tanlang"}
                centered
                size="xs"
                footer={
                  <CusButton
                    className="w-full"
                    isDisabled={yearlyDates.length === 0}
                    onClick={() => setIsYearlyPickerOpen(false)}
                    style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
                  >
                    Tasdiqlash
                  </CusButton>
                }
              >
                <CusCalendar
                  inline
                  selectionMode={isEditing ? "single" : "multiple"}
                  value={yearlyDates}
                  onValueChange={(details) => setYearlyDates(details.value)}
                />
              </CusDialog>
            </div>
          )}

          <CusTimepicker
            label="Boshlanish soati"
            placeholder="ЧЧ:ММ"
            value={time}
            onChange={setTime}
            variant="modal"
            modalTitle="Vaqtni tanlang"
          />

          <div className="flex flex-col gap-1">
            <CusTimepicker
              label="Tugash soati *"
              placeholder="ЧЧ:ММ"
              value={endTime}
              onChange={setEndTime}
              minTime={time}
              variant="modal"
              modalTitle="Tugash vaqtini tanlang"
            />
            {!isEndTimeValid && (
              <span className="text-xs text-error-strong">
                Tugash soati boshlanish soatidan keyin bo'lishi kerak
              </span>
            )}
          </div>

          {!isPersonal && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                Сотрудники
              </span>
              <AssigneeChecklist
                members={members}
                selectedIds={memberIds}
                onToggle={toggleMember}
                isLoading={isMembersPending}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-secondary">
              Приоритет
            </span>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <Pill
                  key={p.value}
                  label={p.label}
                  icon={<IoFlagSharp size={14} />}
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
                ref={subtaskInputRef}
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

          <div className="flex flex-col gap-2">
            <CusFileUpload
              variant="button"
              maxFiles={5}
              buttonText="Прикрепить файл"
              onFileChange={setFiles}
            />
            {files.length > 0 && (
              <span className="text-xs text-secondary">{files.length} ta fayl biriktirildi</span>
            )}
          </div>
        </div>
      )}
    </CusDrawer>
  );
}
