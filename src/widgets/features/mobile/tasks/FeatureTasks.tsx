import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useSessionStore } from "@/store/session.store";
import { WORKSPACE_ROLES } from "@/const/roles";
import { hasRole } from "@/components/shared/role-gate/RoleGate";
import {
  LuCircle,
  LuLoaderCircle,
  LuCircleCheck,
  LuCircleX,
  LuListChecks,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import type { TaskStatusColor } from "@/components/shared/task-card/mini-components/TaskStatusLabel";
import { projectsApi } from "@/api/projects/projects.api";
import type { RawTask, TaskStatus } from "@/api/tasks/tasks.types";
import { fromApiDate, getDayKind, todayApiDate } from "@/utils/apiDate";
import { formatWeekdayDate } from "@/utils/formatWeekdayDate";
import ProjectsTabs from "@/components/shared/project-tab/ProjectsTabs";
import PageTitleDynamic from "@/components/shared/page-title-dynamic/PageTitleDynamic";
import StatusTab from "@/components/shared/status-tab/StatusTab";
import { CusBadge } from "@/components/ui/badge/CusBadge";
import TaskCard from "@/components/shared/task-card/TaskCard";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import FilterSectionTask from "./components/FilterSectionTask";
import MembersFilterButton from "./components/MembersFilterButton";
import { MembersFilterDrawer } from "./modals/MembersFilterDrawer";
import TaskAddButton, {
  TASK_ADD_BUTTON_OFFSET,
} from "@/components/shared/task-button/TaskAddButton";
import TaskModalAdd, { type TaskModalAddValues } from "@/components/shared/task-modals/TaskModalAdd";
import TaskModalEdit, { type TaskModalEditValues } from "@/components/shared/task-modals/TaskModalEdit";
import TaskModalDelete from "@/components/shared/task-modals/TaskModalDelete";
import {
  toTaskMemberCard,
  useCreateTask,
  useDeleteTask,
  useOrganizationRole,
  useProjectMembersForTask,
  useRemoveTaskFile,
  useTasksList,
  useUpdateTask,
  useUploadTaskFile,
} from "./hooks/useApiTasks";

const SORT_KEYS = ["deadline", "priority", "created"] as const;

const SORT_TO_API = {
  deadline: "deadline",
  priority: "priority",
  created: "created_at",
} as const;

// Statik metama'lumot (id/label/rang) — sonlar esa aktiv loyihaning
// `task_counts`'idan dinamik olinadi (pastga qarang, komponent ichida).
const STATUS_META = [
  { id: "assigned", labelKey: "common.taskStatus.todo" as const, color: "gray" as const, countKey: "todo" as const },
  { id: "in_progress", labelKey: "common.taskStatus.in_progress" as const, color: "brand" as const, countKey: "in_progress" as const },
  { id: "done", labelKey: "common.taskStatus.done" as const, color: "success" as const, countKey: "done" as const },
  { id: "failed", labelKey: "common.taskStatus.not_done" as const, color: "error" as const, countKey: "not_done" as const },
];

// Checkbox ustidagi CusMenuList uchun: har bir status uchun ikonka va rang.
// STATUS_META bilan id orqali mos keladi.
const STATUS_ICON: Record<string, ReactNode> = {
  assigned: <LuCircle size={14} />,
  in_progress: <LuLoaderCircle size={14} />,
  done: <LuCircleCheck size={14} />,
  failed: <LuCircleX size={14} />,
};

const STATUS_ICON_COLOR: Record<TaskStatusColor, string> = {
  gray: "var(--text-secondary)",
  brand: "var(--brand-default)",
  success: "var(--status-success-solid)",
  error: "var(--status-error-solid)",
};

// Matn render paytida olinadi (til almashsa yangilanadi) — shu sabab funksiya.
const buildStatusMenuOptions = () => STATUS_META.map((meta) => ({
  id: meta.id,
  label: i18n.t(meta.labelKey),
  icon: STATUS_ICON[meta.id],
  iconColor: STATUS_ICON_COLOR[meta.color],
}));

function TaskCardSkeleton() {
  return <div className="h-[132px] animate-pulse rounded-input border border-subtle bg-surface" />;
}

function TasksEmptyState({ statusLabel }: { statusLabel: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        <LuListChecks size={20} />
      </span>
      <p className="text-sm font-medium text-primary">
        {t("tasks.page.empty", { status: statusLabel })}
      </p>
      <p className="text-xs text-secondary">
        {t("tasks.page.emptyHint")}
      </p>
    </div>
  );
}

function formatDueLabel(task: RawTask): string {
  if (!task.due_at) return i18n.t("tasks.card.noDeadline");
  const d = new Date(task.due_at);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month} ${hh}:${mm}`;
}

interface TasksNavigationState {
  /** /calendar'dan "shu kunga o't" bilan kelganda beriladi — YYYY-MM-DD. */
  date?: string;
  /** /calendar'da loyiha bosilganda — shu loyiha tab'i aktiv ochiladi. */
  projectId?: string;
}

export default function FeatureTasks() {
  const { t } = useTranslation();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  // Personal workspace — bitta foydalanuvchi: xodim filtri va xodim tanlash kerak emas.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const location = useLocation();
  const navigationState = location.state as TasksNavigationState | null;
  const navigationDate = navigationState?.date;

  // Kalendardan aniq sana bilan kelinishi mumkin — bo'lmasa bugungi kun.
  const [selectedDate, setSelectedDate] = useState(() => navigationDate ?? todayApiDate());
  const isToday = selectedDate === todayApiDate();
  // O'tgan kun — faqat ko'rish rejimi: vazifa qo'shish/o'zgartirish yopiq.
  const isPast = getDayKind(selectedDate) === "past";

  const projectsQuery = useQuery({
    queryKey: ["organizations", organizationId, "projects", selectedDate] as const,
    // task_counts faqat tanlangan sanaga tegishli vazifalar bo'yicha hisoblanadi.
    queryFn: () => projectsApi.list(organizationId!, { limit: 100, date: selectedDate }),
    enabled: !!organizationId,
  });
  const projects = projectsQuery.data?.projects ?? [];
  const projectTabs = projects.map((p) => ({
    id: String(p.id),
    projectName: p.name,
    projectTaskCount: p.task_counts.total,
  }));

  // Kalendardan loyiha bilan kelinsa — o'sha tab; ro'yxatda bo'lmasa quyidagi effekt birinchisiga qaytaradi.
  const [activeTabId, setActiveTabId] = useState(() => navigationState?.projectId ?? "");

  // Loyihalar yuklangach yoki workspace almashganda — javobdagi birinchi
  // loyiha ([0]) avtomatik aktiv qilinadi.
  useEffect(() => {
    if (projectTabs.length === 0) return;
    const hasActiveTab = projectTabs.some((tab) => tab.id === activeTabId);
    if (!hasActiveTab) {
      setActiveTabId(projectTabs[0].id);
    }
  }, [projectTabs, activeTabId]);

  // StatusTab'dagi sonlar aktiv loyihaning task_counts'idan olinadi — loyiha
  // almashtirilganda avtomatik yangilanadi.
  const activeProjectCounts = projects.find(
    (p) => String(p.id) === activeTabId,
  )?.task_counts;
  const statusTabs = STATUS_META.map((meta) => ({
    id: meta.id,
    label: t(meta.labelKey),
    color: meta.color,
    count: activeProjectCounts?.[meta.countKey] ?? 0,
  }));

  const [sort, setSort] = useState<keyof typeof SORT_TO_API>("deadline");
  const [statusId, setStatusId] = useState(() => (isPast ? "failed" : "assigned"));
  // O'tgan kunda avval bajarilmaganlar qiziqtiradi; bugunga qaytilsa — "Berildi".
  useEffect(() => {
    setStatusId(isPast ? "failed" : "assigned");
  }, [isPast]);
  const activeStatusMeta = STATUS_META.find((m) => m.id === statusId);

  // "Xodim bo'yicha" filtr workspace owner/admin/viewer yoki shu loyihaning
  // project_manager'iga ko'rinadi — oddiy a'zolar faqat o'z vazifalarini ko'radi.
  const currentUserId = useSessionStore((s) => s.user?.id);
  const activeProject = projects.find((p) => String(p.id) === activeTabId);
  const { data: workspaceRole } = useOrganizationRole(organizationId);
  const isProjectManager = activeProject?.members.some(
    (m) => m.user_id === currentUserId && m.role === "project_manager",
  );
  // Vazifa berish, tahrirlash va o'chirish — workspace owner/admin yoki loyiha project_manager'i.
  // Personal'da foydalanuvchi o'z workspace'ining owner'i — shu shart orqali ruxsat oladi.
  const canManageTasks =
    hasRole(workspaceRole ? [workspaceRole] : [], [WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.ADMIN]) ||
    !!isProjectManager;

  const canFilterByEmployee =
    !isPersonal &&
    (hasRole(workspaceRole ? [workspaceRole] : [], [
      WORKSPACE_ROLES.OWNER,
      WORKSPACE_ROLES.ADMIN,
      WORKSPACE_ROLES.VIEWER,
    ]) ||
      !!isProjectManager);

  // Bo'sh massiv — "hamma xodimlar".
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isMembersFilterOpen, setIsMembersFilterOpen] = useState(false);
  // Loyiha almashtirilganda — oldingi loyihaning xodim id'lari mos kelmay qolishi mumkin.
  useEffect(() => {
    setSelectedMemberIds([]);
  }, [activeTabId]);
  const activeProjectMembers = (activeProject?.members ?? []).map(toTaskMemberCard);

  const tasksQuery = useTasksList(organizationId, activeTabId, {
    status: activeStatusMeta?.countKey as TaskStatus | undefined,
    sort_by: SORT_TO_API[sort],
    date: selectedDate,
    member_ids:
      canFilterByEmployee && selectedMemberIds.length > 0
        ? selectedMemberIds.join(",")
        : undefined,
    limit: 100,
  });
  const tasks = tasksQuery.data?.tasks ?? [];

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const toggleExpanded = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  // "Bajarildi"ga o'tkazishdan oldin, hali bajarilmagan subtasklar bo'lsa,
  // shu yerda tasdiq kutiladi — CusDialog shu holatga qarab ochiladi.
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    taskId: string;
    nextStatusId: string;
  } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data: projectMembersForTask, isPending: isProjectMembersPending } =
    useProjectMembersForTask(organizationId, activeTabId, isAddOpen || editingTaskId !== null);

  const [errorToast, setErrorToast] = useState<string | null>(null);
  useEffect(() => {
    if (!errorToast) return;
    const t = setTimeout(() => setErrorToast(null), 4000);
    return () => clearTimeout(t);
  }, [errorToast]);

  const createTask = useCreateTask(organizationId, activeTabId);
  const updateTask = useUpdateTask(organizationId, activeTabId);
  const deleteTask = useDeleteTask(organizationId, activeTabId);
  const uploadFile = useUploadTaskFile(organizationId, activeTabId);
  const removeFile = useRemoveTaskFile(organizationId, activeTabId);

  const addTask = async (values: TaskModalAddValues) => {
    if (!organizationId || !activeTabId) return;
    try {
      let descriptionPayload: string | { type: "audio"; file_id: number } | undefined;
      if (values.descriptionAudio) {
        const audioFile = new File(
          [values.descriptionAudio.blob],
          "voice-note.webm",
          { type: values.descriptionAudio.blob.type || "audio/webm" },
        );
        const uploaded = await uploadFile.mutateAsync({
          file: audioFile,
          kind: "description_audio",
        });
        descriptionPayload = { type: "audio", file_id: uploaded[0].id };
      } else if (values.description) {
        descriptionPayload = values.description;
      }

      let fileIds: number[] | undefined;
      if (values.files.length > 0) {
        const uploads = await Promise.all(
          values.files.map((f) => uploadFile.mutateAsync({ file: f.file, kind: "attachment" })),
        );
        fileIds = uploads.flatMap((uploadedFiles) => uploadedFiles.map((f) => f.id));
      }

      // Personal workspace'da xodim tanlanmaydi — vazifa foydalanuvchining o'ziga biriktiriladi.
      const members = isPersonal
        ? currentUserId
          ? [{ user_id: Number(currentUserId) }]
          : []
        : values.assignees.map((a) => ({ user_id: Number(a.id) }));
      const subtasks = values.subtasks.map((s) => ({ name: s.label, checked: s.checked }));

      await createTask.mutateAsync({
        title: values.title,
        members,
        description: descriptionPayload,
        priority: values.priority,
        due_at: values.dueAt,
        file_ids: fileIds,
        subtasks,
      });
    } catch (err) {
      setErrorToast(getApiErrorMessage(err));
      // Qayta tashlanadi — TaskModalAdd shuni ko'rib, drawer'ni yopmay ochiq qoldiradi.
      throw err;
    }
  };

  const editTask = async (values: TaskModalEditValues) => {
    if (!organizationId || !activeTabId || !editingTaskId) return;
    try {
      let descriptionPayload: string | { type: "audio"; file_id: number } | null | undefined;
      if (values.descriptionMode === "text") {
        descriptionPayload = values.description;
      } else if (values.descriptionAudio) {
        const audioFile = new File(
          [values.descriptionAudio.blob],
          "voice-note.webm",
          { type: values.descriptionAudio.blob.type || "audio/webm" },
        );
        const uploaded = await uploadFile.mutateAsync({
          file: audioFile,
          kind: "description_audio",
        });
        descriptionPayload = { type: "audio", file_id: uploaded[0].id };
      } else if (values.audioRemoved) {
        descriptionPayload = null;
        if (values.removedAudioFileId) {
          await removeFile.mutateAsync({ taskId: editingTaskId, fileId: values.removedAudioFileId });
        }
      }
      // aks holda (ovozli izoh o'zgartirilmagan) — description umuman yuborilmaydi.

      for (const fileId of values.removedFileIds) {
        await removeFile.mutateAsync({ taskId: editingTaskId, fileId });
      }

      let fileIds: number[] | undefined;
      if (values.newFiles.length > 0) {
        const uploads = await Promise.all(
          values.newFiles.map((f) => uploadFile.mutateAsync({ file: f.file, kind: "attachment" })),
        );
        fileIds = uploads.flatMap((uploadedFiles) => uploadedFiles.map((f) => f.id));
      }

      const members = values.assignees.map((a) => ({ user_id: Number(a.id) }));
      const subtasks = values.subtasks.map((s) => ({ name: s.label, checked: s.checked }));

      await updateTask.mutateAsync({
        taskId: editingTaskId,
        payload: {
          title: values.title,
          members,
          description: descriptionPayload,
          priority: values.priority,
          due_at: values.dueAt,
          file_ids: fileIds,
          subtasks,
        },
      });
    } catch (err) {
      setErrorToast(getApiErrorMessage(err));
      throw err;
    }
  };

  const editingTask = tasks.find((t) => String(t.id) === editingTaskId);
  const deletingTask = tasks.find((t) => String(t.id) === deletingTaskId);

  const applyStatusChange = (taskId: string, nextStatusId: string) => {
    const meta = STATUS_META.find((m) => m.id === nextStatusId);
    if (!meta) return;
    updateTask.mutate(
      { taskId, payload: { status: meta.countKey } },
      { onError: (err) => setErrorToast(getApiErrorMessage(err)) },
    );
  };

  const requestStatusChange = (task: RawTask, nextStatusId: string) => {
    const hasUnfinishedSubtasks = task.subtasks.some((s) => !s.checked);
    if (nextStatusId === "done" && hasUnfinishedSubtasks) {
      setPendingStatusChange({ taskId: String(task.id), nextStatusId });
      return;
    }
    applyStatusChange(String(task.id), nextStatusId);
  };

  const pendingTask = pendingStatusChange
    ? tasks.find((t) => String(t.id) === pendingStatusChange.taskId)
    : undefined;

  // Bugungi kun bo'lsa — oddiy matn; kalendardan boshqa sana bilan kelingan
  // bo'lsa — yopish (X) tugmali badge, bosilsa yana bugunga qaytaradi.
  const dateLabel = isToday ? (
    formatWeekdayDate()
  ) : (
    <CusBadge
      tone="brand"
      variant="subtle"
      size="lg"
      rightIcon={
        <LuX
          size={14}
          className="cursor-pointer"
          onClick={() => setSelectedDate(todayApiDate())}
        />
      }
    >
      {formatWeekdayDate(fromApiDate(selectedDate))}
    </CusBadge>
  );

  return (
    <div>
      <div
        className="flex flex-col gap-3 p-4"
        style={{
          paddingBottom: `calc(${TASK_ADD_BUTTON_OFFSET} + 56px + 12px)`,
        }}
      >
        <PageTitleDynamic
          title={t("tasks.page.title")}
          date={dateLabel}
          doneCount={activeProjectCounts?.done ?? 0}
          totalCount={activeProjectCounts?.total ?? 0}
          statusLabel={t("common.taskStatus.done")}
        />
        {isPast && (
          <div
            className="flex items-center justify-between gap-3 rounded-card px-3 py-2"
            style={{
              background: "var(--status-warning-bg)",
              color: "var(--status-warning-text)",
            }}
          >
            <span className="text-sm font-medium">
              {t("tasks.page.pastBanner")}
            </span>
            <CusButton
              variant="outline"
              size="xs"
              rounded="9999px"
              onClick={() => setSelectedDate(todayApiDate())}
              style={{
                borderColor: "var(--status-warning-text)",
                color: "var(--status-warning-text)",
              }}
            >
              {t("common.actions.today")}
            </CusButton>
          </div>
        )}
        <ProjectsTabs
          tabs={projectTabs}
          activeId={activeTabId}
          onChange={setActiveTabId}
        />
        <div className="flex items-center gap-2">
          <span className="mr-auto text-xs font-medium uppercase tracking-wide text-secondary">
            {t("tasks.page.filter")}
          </span>
          <FilterSectionTask
            value={sort}
            onValueChange={(v) => setSort(v as keyof typeof SORT_TO_API)}
            menulist={SORT_KEYS.map((key) => ({ value: key, label: t(`tasks.sort.${key}`) }))}
          />
          {canFilterByEmployee && (
            <MembersFilterButton
              selectedCount={selectedMemberIds.length}
              onClick={() => setIsMembersFilterOpen(true)}
            />
          )}
        </div>
        <StatusTab
          items={statusTabs}
          activeId={statusId}
          onChange={setStatusId}
          className="sticky top-0 z-sticky -mx-4 bg-canvas px-4 py-2"
        />

        {tasksQuery.isPending ? (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        ) : tasksQuery.isError ? (
          <p className="px-1 text-sm text-error-strong">
            {t("tasks.page.loadError")}
          </p>
        ) : tasks.length === 0 ? (
          <TasksEmptyState statusLabel={activeStatusMeta ? t(activeStatusMeta.labelKey) : ""} />
        ) : (
          tasks.map((task) => {
            const expanded = expandedIds.has(task.id);
            const meta = STATUS_META.find((m) => m.countKey === task.status);
            const descriptionAudioFile = task.files.find(
              (f) => f.kind === "description_audio",
            );
            const attachments = task.files.filter((f) => f.kind === "attachment");
            const imageAttachments = attachments.filter((f) =>
              f.mime_type.startsWith("image/"),
            );
            const nonImageAttachments = attachments.filter(
              (f) => !f.mime_type.startsWith("image/"),
            );
            return (
              <TaskCard
                key={task.id}
                title={task.title}
                statusOptions={buildStatusMenuOptions()}
                statusId={meta?.id ?? "assigned"}
                onStatusChange={(nextStatusId) => requestStatusChange(task, nextStatusId)}
                priority={task.priority}
                dateRangeLabel={formatDueLabel(task)}
                readOnly={isPast}
                canManage={canManageTasks}
                isOverdue={
                  task.status !== "done" && !!task.due_at && new Date(task.due_at) < new Date()
                }
                subtaskCountLabel={`${task.subtasks.filter((s) => s.checked).length}/${task.subtasks.length}`}
                fileCount={attachments.length}
                members={task.members.map(toTaskMemberCard)}
                statusLabel={meta ? t(meta.labelKey) : ""}
                statusColor={meta?.color ?? "gray"}
                expanded={expanded}
                onToggleExpanded={() => toggleExpanded(task.id)}
                description={task.description_type === "text" ? (task.description ?? "") : ""}
                descriptionAudio={
                  descriptionAudioFile
                    ? { url: descriptionAudioFile.url, durationLabel: "0:00" }
                    : undefined
                }
                projectTag={projects.find((p) => p.id === task.project_id)?.name ?? ""}
                subtasks={task.subtasks.map((s) => ({
                  id: String(s.id),
                  label: s.name,
                  checked: s.checked,
                }))}
                onSubtaskChange={(id, checked) =>
                  updateTask.mutate(
                    {
                      taskId: String(task.id),
                      payload: {
                        subtasks: task.subtasks.map((s) => ({
                          name: s.name,
                          checked: String(s.id) === id ? checked : s.checked,
                        })),
                      },
                    },
                    { onError: (err) => setErrorToast(getApiErrorMessage(err)) },
                  )
                }
                photos={imageAttachments.map((f) => ({
                  id: String(f.id),
                  url: f.url,
                }))}
                files={nonImageAttachments.map((f) => ({
                  id: String(f.id),
                  name: f.file_name,
                  sizeLabel: `${Math.round(f.size_bytes / 1024)} KB`,
                }))}
                onDownloadFile={(id) => {
                  const file = task.files.find((f) => String(f.id) === id);
                  if (file) window.open(file.url, "_blank", "noopener,noreferrer");
                }}
                onAttachFile={() => {}}
                onDelete={() => setDeletingTaskId(String(task.id))}
                onEdit={() => setEditingTaskId(String(task.id))}
              />
            );
          })
        )}
      </div>

      <CusDialog
        open={pendingStatusChange !== null}
        onClose={() => setPendingStatusChange(null)}
        title={t("tasks.page.unfinishedTitle")}
        size="sm"
        centered
        footer={
          <>
            <CusButton
              variant="outline"
              onClick={() => setPendingStatusChange(null)}
            >
              {t("common.actions.cancel")}
            </CusButton>
            <CusButton
              onClick={() => {
                if (pendingStatusChange) {
                  applyStatusChange(
                    pendingStatusChange.taskId,
                    pendingStatusChange.nextStatusId,
                  );
                }
                setPendingStatusChange(null);
              }}
              style={{
                background: "var(--brand-default)",
                color: "var(--text-on-brand)",
              }}
            >
              {t("tasks.page.confirmDone")}
            </CusButton>
          </>
        }
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: "50%",
              background: "var(--status-warning-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LuTriangleAlert size={18} color="var(--status-warning-text)" />
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {pendingTask?.title}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {t("tasks.page.unfinishedText", {
                count: pendingTask?.subtasks.filter((s) => !s.checked).length ?? 0,
                status: t("common.taskStatus.done"),
              })}
            </p>
          </div>
        </div>
      </CusDialog>

      <MembersFilterDrawer
        open={isMembersFilterOpen}
        onClose={() => setIsMembersFilterOpen(false)}
        members={activeProjectMembers}
        selectedIds={selectedMemberIds}
        onApply={setSelectedMemberIds}
      />

      {!isPast && canManageTasks && <TaskAddButton onClick={() => setIsAddOpen(true)} />}

      <TaskModalAdd
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={addTask}
        members={projectMembersForTask ?? []}
        isLoadingMembers={isProjectMembersPending}
        hideMembers={isPersonal}
      />

      <TaskModalEdit
        open={editingTaskId !== null}
        onClose={() => setEditingTaskId(null)}
        task={editingTask ?? null}
        members={projectMembersForTask ?? []}
        isLoadingMembers={isProjectMembersPending}
        onSubmit={editTask}
      />

      <TaskModalDelete
        open={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        taskTitle={deletingTask?.title}
        onConfirm={() => {
          if (deletingTaskId) {
            deleteTask.mutate(deletingTaskId, {
              onError: (err) => setErrorToast(getApiErrorMessage(err)),
            });
          }
        }}
      />

      {errorToast && (
        <div
          className="fixed inset-x-4 top-4 z-toast flex items-center gap-2 rounded-card border px-4 py-3 shadow-md"
          style={{
            background: "var(--status-error-bg)",
            borderColor: "var(--status-error-text)",
            color: "var(--status-error-text)",
          }}
        >
          <LuTriangleAlert size={16} className="flex-none" />
          <span className="flex-1 text-sm font-medium">{errorToast}</span>
          <button
            type="button"
            aria-label={t("common.actions.close")}
            onClick={() => setErrorToast(null)}
            className="flex-none"
          >
            <LuX size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
