import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState, forwardRef } from "react";
import type React from "react";
import { useLocation } from "react-router-dom";
import {
  LuArrowUpDown,
  LuChevronDown,
  LuFolderOpen,
  LuKanban,
  LuList,
  LuListChecks,
  LuPlus,
  LuUsers,
} from "react-icons/lu";
import type { RawTask, TaskStatus } from "@/api/tasks/tasks.types";
import { useWorkspaceStore } from "@/store/workspace.store";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusCardbox } from "@/components/ui/cardbox/CusCardbox";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusPageTitle } from "@/components/ui/page-title/CusPageTitle";
import { CusMenuList } from "@/components/ui/menu-list/CusMenuList";
import { CusToasterFull, useToasterFull } from "@/components/ui/toaster/CusToasterFull";
import ProjectsTabs from "@/components/shared/project-tab/ProjectsTabs";
import { MemberPickerDrawer } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import TaskModalAdd from "@/components/shared/task-modals/TaskModalAdd";
import TaskModalEdit from "@/components/shared/task-modals/TaskModalEdit";
import TaskModalDelete from "@/components/shared/task-modals/TaskModalDelete";
import {
  TASK_SORT_KEYS,
  TASK_SORT_TO_API,
  TASK_STATUS_META,
  type TaskSortKey,
} from "@/components/shared/task-card/taskStatusMeta";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";
import { useTaskSubmit } from "@/hooks/useTaskSubmit";
import { useIntlLocale } from "@/i18n/useIntlLocale";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { fromApiDate, getDayKind, todayApiDate } from "@/utils/apiDate";
import { isTaskOverdue } from "@/utils/taskDateLabels";
import {
  toTaskMemberCard,
  useDeleteTask,
  useProjectMembersForTask,
  useProjectsByDate,
  useTasksList,
} from "./hooks/useApiTasks";
import { useTasksViewMode } from "./hooks/useTasksViewMode";
import { TaskRow } from "./components/TaskRow";
import { StatusSegments } from "./components/StatusSegments";
import { KanbanBoard } from "./components/KanbanBoard";
import { TaskDetailsDrawer } from "./modals/TaskDetailsDrawer";

interface TasksNavigationState {
  /** /calendar'dan kelganda — YYYY-MM-DD. Sana tanlash desktop'da /calendar'da. */
  date?: string;
  projectId?: string;
}

// CusMenuList trigger'i DOM proplarini (pozitsiya) oladi — ...props'ni to'liq uzatadigan oddiy button.
const ToolbarButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode; label: string }
>(function ToolbarButton({ icon, label, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      className="flex h-9 items-center gap-2 rounded-input border border-default bg-surface px-3 text-sm font-medium text-primary transition-colors hover:bg-surface-secondary"
    >
      <span className="text-secondary">{icon}</span>
      {label}
      <LuChevronDown size={14} className="text-secondary" />
    </button>
  );
});

function EmptyState({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-avatar bg-surface-secondary text-secondary">
        {icon}
      </span>
      <p className="text-sm font-medium text-primary">{title}</p>
      {hint && <p className="text-xs text-secondary">{hint}</p>}
    </div>
  );
}

export default function FeatureTasks() {
  const { t } = useTranslation();
  const intlLocale = useIntlLocale();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const navigationState = useLocation().state as TasksNavigationState | null;
  const toaster = useToasterFull();
  const showError = (err: unknown) => toaster.show(getApiErrorMessage(err), "error");

  // Sana /calendar'dan keladi; bo'lmasa — bugun.
  const [selectedDate, setSelectedDate] = useState(() => navigationState?.date ?? todayApiDate());
  const isToday = selectedDate === todayApiDate();
  const isPast = getDayKind(selectedDate) === "past";

  // ── Loyihalar (tanlangan sana bo'yicha task_counts) ─────────────────────────
  const projectsQuery = useProjectsByDate(organizationId, selectedDate);
  const projects = projectsQuery.data?.projects ?? [];
  const hasNoProjects = projectsQuery.isSuccess && projects.length === 0;
  // Aktiv loyiha — store'da, sidebar bilan bitta (sidebar'da bosilsa shu yerda ham almashadi).
  const storedProjectId = useWorkspaceStore((s) => s.selectedProjectId);
  const setActiveTabId = useWorkspaceStore((s) => s.selectProject);
  const activeTabId = storedProjectId ?? "";
  // /calendar'dan loyiha bilan kelinsa — o'sha loyiha.
  useEffect(() => {
    if (navigationState?.projectId) setActiveTabId(navigationState.projectId);
  }, [navigationState?.projectId, setActiveTabId]);
  // Ro'yxatda yo'q bo'lsa — birinchi loyiha.
  useEffect(() => {
    if (projects.length === 0) return;
    if (!projects.some((p) => String(p.id) === activeTabId)) setActiveTabId(String(projects[0].id));
  }, [projects, activeTabId, setActiveTabId]);
  const activeProject = projects.find((p) => String(p.id) === activeTabId);
  const counts = activeProject?.task_counts;

  // ── Ruxsatlar ───────────────────────────────────────────────────────────────
  const { isPersonal, currentUserId, isViewer, canManageTasks, canFilterByEmployee } =
    useTaskPermissions(organizationId, activeProject);
  const readOnly = isPast || isViewer;

  // ── Filtrlar ────────────────────────────────────────────────────────────────
  const [statusId, setStatusId] = useState(() => (isPast ? "failed" : "assigned"));
  useEffect(() => {
    setStatusId(isPast ? "failed" : "assigned");
  }, [isPast]);
  const activeStatus = TASK_STATUS_META.find((m) => m.id === statusId);
  const [sort, setSort] = useState<TaskSortKey>("deadline");
  const [viewMode, setViewMode] = useTasksViewMode();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isMembersFilterOpen, setMembersFilterOpen] = useState(false);
  useEffect(() => {
    setSelectedMemberIds([]);
  }, [activeTabId]);

  // Kanban'da barcha statuslar bir vaqtda ustunlarga bo'linadi — status filtri qo'llanmaydi.
  const tasksQuery = useTasksList(organizationId, activeTabId, {
    status: viewMode === "board" ? undefined : (activeStatus?.countKey as TaskStatus | undefined),
    sort_by: TASK_SORT_TO_API[sort],
    date: selectedDate,
    member_ids:
      canFilterByEmployee && selectedMemberIds.length > 0 ? selectedMemberIds.join(",") : undefined,
    limit: 100,
  });
  const tasks = useMemo(() => tasksQuery.data?.tasks ?? [], [tasksQuery.data]);

  // ── Modallar ────────────────────────────────────────────────────────────────
  const [detailsTaskId, setDetailsTaskId] = useState<string | null>(null);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [pendingDone, setPendingDone] = useState<RawTask | null>(null);
  const findTask = (id: string | null) => tasks.find((task) => String(task.id) === id) ?? null;
  const detailsTask = findTask(detailsTaskId);
  const editingTask = findTask(editingTaskId);
  const deletingTask = findTask(deletingTaskId);

  const { data: projectMembers = [], isPending: isMembersPending } = useProjectMembersForTask(
    organizationId,
    activeTabId,
    !isPersonal && (isAddOpen || editingTaskId !== null),
  );

  const { addTask, editTask, updateTask } = useTaskSubmit({
    organizationId,
    projectId: activeTabId,
    isPersonal,
    currentUserId,
  });
  const deleteTask = useDeleteTask(organizationId, activeTabId);

  const applyStatus = (task: RawTask, nextStatusId: string) => {
    const meta = TASK_STATUS_META.find((m) => m.id === nextStatusId);
    if (!meta) return;
    updateTask.mutate({ taskId: String(task.id), payload: { status: meta.countKey } }, { onError: showError });
  };
  /**
   * "Бажарилмади" (not_done) — faqat muddati o'tmagan bo'lsa "Бажарилди"га
   * o'tkaziladi; boshqa statusga yoki muddat o'tgandan keyin bloklanadi
   * (kanban drag'da ham, status-menyuda ham — bitta joydan tekshiriladi).
   */
  const blockedStatusReason = (task: RawTask, nextStatusId: string): string | null => {
    if (task.status !== "not_done") return null;
    if (isTaskOverdue(task)) return t("tasks.page.statusLockedExpired");
    if (nextStatusId !== "done") {
      return t("tasks.page.statusLockedNotDoneOnly", {
        notDone: t("common.taskStatus.not_done"),
        done: t("common.taskStatus.done"),
      });
    }
    return null;
  };
  // "Bajarildi"ga o'tkazishda bajarilmagan subtask bo'lsa — avval tasdiq.
  const requestStatus = (task: RawTask, nextStatusId: string) => {
    const blocked = blockedStatusReason(task, nextStatusId);
    if (blocked) {
      toaster.show(blocked, "error");
      return;
    }
    if (nextStatusId === "done" && task.subtasks.some((s) => !s.checked)) {
      setPendingDone(task);
      return;
    }
    applyStatus(task, nextStatusId);
  };
  const changeSubtask = (task: RawTask, subtaskId: string, checked: boolean) =>
    updateTask.mutate(
      {
        taskId: String(task.id),
        payload: {
          subtasks: task.subtasks.map((s) => ({
            name: s.name,
            checked: String(s.id) === subtaskId ? checked : s.checked,
          })),
        },
      },
      { onError: showError },
    );

  const withToast = <T,>(fn: (v: T) => Promise<void>) => async (values: T) => {
    try {
      await fn(values);
    } catch (err) {
      showError(err);
      throw err; // modal ochiq qoladi
    }
  };

  // ── Matnlar ─────────────────────────────────────────────────────────────────
  const dateObj = fromApiDate(selectedDate);
  const dateLabel = new Intl.DateTimeFormat(intlLocale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(dateObj);
  const weekday = new Intl.DateTimeFormat(intlLocale, { weekday: "long" }).format(dateObj);
  const projectName = activeProject?.name ?? "";
  const statusItems = TASK_STATUS_META.map((meta) => ({
    id: meta.id,
    label: t(meta.labelKey),
    color: meta.color,
    count: counts?.[meta.countKey] ?? 0,
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* Sarlavha */}
      <CusPageTitle
        className=""
        title={isToday ? t("tasks.desktop.titleToday") : t("tasks.desktop.titleDate", { date: dateLabel })}
        subtitle={
          <>
            {counts?.done ?? 0}/{counts?.total ?? 0} {t("tasks.desktop.doneOf")}
          </>
        }
        action={
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="text-2xl font-bold text-primary">{dateLabel}</span>
            <span className="text-xs uppercase tracking-wide text-secondary">{weekday}</span>
            {!isToday && (
              <button
                type="button"
                onClick={() => setSelectedDate(todayApiDate())}
                className="text-xs font-semibold text-brand hover:underline"
              >
                {t("tasks.desktop.backToToday")}
              </button>
            )}
          </div>
        }
      />

      {isPast && (
        <div className="rounded-card bg-warning-soft px-4 py-2 text-sm font-medium text-warning-strong">
          {t("tasks.page.pastBanner")}
        </div>
      )}

      {hasNoProjects ? (
        <EmptyState
          icon={<LuFolderOpen size={20} />}
          title={isPersonal ? t("tasks.page.noProjectsPersonal") : t("tasks.page.noProjects")}
          hint={isPersonal ? t("tasks.page.noProjectsPersonalHint") : t("tasks.page.noProjectsHint")}
        />
      ) : (
        <>
          <ProjectsTabs
            tabs={projects.map((p) => ({
              id: String(p.id),
              projectName: p.name,
              projectTaskCount: p.task_counts.total,
            }))}
            activeId={activeTabId}
            onChange={setActiveTabId}
          />

          {/* Asboblar qatori: chapda saralash nomi, o'ngda filtrlar, ko'rinish va "+ Задача" */}
          <div className="flex items-center gap-2">
            <span className="mr-auto text-xs font-medium uppercase tracking-wide text-secondary">
              {t(`tasks.sort.${sort}`)}
            </span>
            {canFilterByEmployee && (
              <ToolbarButton
                icon={<LuUsers size={14} />}
                label={
                  selectedMemberIds.length > 0
                    ? t("tasks.membersFilter.buttonWithCount", { count: selectedMemberIds.length })
                    : t("tasks.membersFilter.button")
                }
                onClick={() => setMembersFilterOpen(true)}
              />
            )}
            <CusMenuList
              value={sort}
              onValueChange={(v) => setSort(v as TaskSortKey)}
              items={TASK_SORT_KEYS.map((key) => ({ value: key, label: t(`tasks.sort.${key}`) }))}
              width={200}
              trigger={<ToolbarButton icon={<LuArrowUpDown size={14} />} label={t(`tasks.sort.${sort}`)} />}
            />
            <div className="flex overflow-hidden rounded-input border border-default">
              {(["list", "board"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-label={t(`tasks.desktop.view${mode === "list" ? "List" : "Board"}`)}
                  onClick={() => setViewMode(mode)}
                  className="flex size-9 items-center justify-center transition-colors"
                  // Chakra'ning button stillari bg sinfini bosadi — fon inline (token, hex emas).
                  style={
                    viewMode === mode
                      ? { background: "var(--brand-default)", color: "var(--text-on-brand)" }
                      : { background: "var(--bg-surface)", color: "var(--text-secondary)" }
                  }
                >
                  {mode === "list" ? <LuList size={16} /> : <LuKanban size={16} />}
                </button>
              ))}
            </div>
            {canManageTasks && !isPast && (
              <CusButton
                leftIcon={<LuPlus size={16} />}
                onClick={() => setAddOpen(true)}
                style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
              >
                {t("tasks.card.addTask")}
              </CusButton>
            )}
          </div>

          {viewMode !== "board" && (
            <StatusSegments items={statusItems} activeId={statusId} onChange={setStatusId} />
          )}

          {/* Ro'yxat / doska */}
          {tasksQuery.isPending ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[60px] animate-pulse rounded-card border border-subtle bg-surface" />
              ))}
            </div>
          ) : tasksQuery.isError ? (
            <p className="px-1 text-sm text-error-strong">{t("tasks.page.loadError")}</p>
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={<LuListChecks size={20} />}
              title={
                viewMode === "board"
                  ? t("tasks.page.emptyBoard")
                  : t("tasks.page.empty", { status: activeStatus ? t(activeStatus.labelKey) : "" })
              }
              hint={t("tasks.page.emptyHint")}
            />
          ) : viewMode === "list" ? (
            <CusCardbox
              style={{ padding: 0 }}
              className="flex flex-col divide-y divide-[var(--border-subtle)] overflow-hidden rounded-card"
            >
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  projectName={projectName}
                  readOnly={readOnly}
                  onStatusChange={(next) => requestStatus(task, next)}
                  onOpen={() => setDetailsTaskId(String(task.id))}
                />
              ))}
            </CusCardbox>
          ) : (
            <KanbanBoard
              tasks={tasks}
              projectName={projectName}
              readOnly={readOnly}
              onStatusChange={(task, next) => requestStatus(task, next)}
              onOpen={(task) => setDetailsTaskId(String(task.id))}
            />
          )}
        </>
      )}

      {/* Tafsilot — o'ngdan drawer */}
      <TaskDetailsDrawer
        task={detailsTask}
        projectName={projectName}
        onClose={() => setDetailsTaskId(null)}
        readOnly={readOnly}
        canManage={canManageTasks}
        onStatusChange={(next) => detailsTask && requestStatus(detailsTask, next)}
        onSubtaskChange={(id, checked) => detailsTask && changeSubtask(detailsTask, id, checked)}
        onEdit={() => {
          setEditingTaskId(detailsTaskId);
          setDetailsTaskId(null);
        }}
        onDelete={() => {
          setDeletingTaskId(detailsTaskId);
          setDetailsTaskId(null);
        }}
      />

      {/* Qo'shish / tahrirlash — markazdagi keng dialog, ikki ustun */}
      <TaskModalAdd
        layout="split"
        open={isAddOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={withToast(addTask)}
        members={projectMembers}
        isLoadingMembers={isMembersPending}
        hideMembers={isPersonal}
      />
      <TaskModalEdit
        layout="split"
        open={editingTaskId !== null}
        onClose={() => setEditingTaskId(null)}
        task={editingTask}
        members={projectMembers}
        isLoadingMembers={isMembersPending}
        hideMembers={isPersonal}
        onSubmit={withToast((values) => editTask(editingTaskId ?? "", values))}
      />
      <TaskModalDelete
        open={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        taskTitle={deletingTask?.title}
        onConfirm={() => {
          if (deletingTaskId) deleteTask.mutate(deletingTaskId, { onError: showError });
        }}
      />

      {/* Bajarilmagan subtasklar bilan "Выполнено" — tasdiq */}
      <CusDialog
        open={pendingDone !== null}
        onClose={() => setPendingDone(null)}
        title={t("tasks.page.unfinishedTitle")}
        size="sm"
        centered
        footer={
          <>
            <CusButton variant="outline" onClick={() => setPendingDone(null)}>
              {t("common.actions.cancel")}
            </CusButton>
            <CusButton
              onClick={() => {
                if (pendingDone) applyStatus(pendingDone, "done");
                setPendingDone(null);
              }}
              style={{ background: "var(--status-success-solid)", color: "var(--text-on-brand)" }}
            >
              {t("tasks.page.confirmDone")}
            </CusButton>
          </>
        }
      >
        <p className="text-sm text-primary">
          {t("tasks.page.unfinishedText", {
            count: pendingDone?.subtasks.filter((s) => !s.checked).length ?? 0,
            status: t("common.taskStatus.done"),
          })}
        </p>
      </CusDialog>

      {canFilterByEmployee && (
        <MemberPickerDrawer
          variant="dialog"
          open={isMembersFilterOpen}
          onClose={() => setMembersFilterOpen(false)}
          title={t("tasks.membersFilter.title")}
          members={(activeProject?.members ?? []).map(toTaskMemberCard).map((m) => ({ id: m.id, name: m.name }))}
          selectedIds={selectedMemberIds}
          onApply={(ids) => {
            setSelectedMemberIds(ids);
            setMembersFilterOpen(false);
          }}
        />
      )}

      <CusToasterFull items={toaster.items} onRemove={toaster.remove} />
    </div>
  );
}
