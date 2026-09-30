import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { LuPlus, LuTriangleAlert, LuX } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import ProjectsTabs from "@/components/shared/project-tab/ProjectsTabs";
import TaskCardRoutine from "@/components/shared/task-card-routine/TaskCardRoutine";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import { RoutineFrequencyTabs } from "@/components/shared/settings/repeating-tasks/components/RoutineFrequencyTabs";
import {
  RoutineFormDrawer,
  type RoutineFormInitial,
} from "@/components/shared/settings/repeating-tasks/modals/RoutineFormDrawer";
import { RoutineScheduleDialog } from "@/components/shared/settings/repeating-tasks/modals/RoutineScheduleDialog";
import {
  useDeleteRoutine,
  useOrgMembersDirectory,
  useOrgProjectsForRoutines,
  useRoutinesForProjects,
  useUpdateRoutine,
} from "@/components/shared/settings/repeating-tasks/hooks/useApiRepeatingTasks";
import {
  formatNextRunLabel,
  formatRepeatLabel,
} from "@/components/shared/settings/repeating-tasks/lib/formatRoutine";
import type { RoutineFilter } from "@/components/shared/settings/repeating-tasks/types";
import type { RawTaskRoutine } from "@/api/task-routines/task-routines.types";
import { useIsViewer } from "@/hooks/useIsViewer";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { initialsOf } from "@/utils/calendarDay";
import { SettingsSectionHeader } from "@/widgets/features/desktop/settings/components/SettingsSectionHeader";

const ALL_PROJECTS_ID = "all";

export default function FeatureSettingsRepeatingTasks() {
  const { t } = useTranslation();
  const organizationId = useWorkspaceStore((s) => s.selectedWorkspaceId);
  const [projectId, setProjectId] = useState(ALL_PROJECTS_ID);
  const [frequency, setFrequency] = useState<RoutineFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<RoutineFormInitial | null>(null);
  const [deletingRoutine, setDeletingRoutine] = useState<RoutineFormInitial | null>(null);
  const [scheduleRoutine, setScheduleRoutine] = useState<RawTaskRoutine | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    if (!errorToast) return;
    const id = setTimeout(() => setErrorToast(null), 4000);
    return () => clearTimeout(id);
  }, [errorToast]);

  const { data: allProjects = [] } = useOrgProjectsForRoutines(organizationId);
  // Personal workspace'da boshqa xodim yo'q — kartalardagi avatarlar uchun ro'yxat so'ralmaydi.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const { data: membersDirectory = [] } = useOrgMembersDirectory(organizationId, !isPersonal);
  const { routines, isPending: isRoutinesPending } = useRoutinesForProjects(organizationId, allProjects);
  const updateRoutine = useUpdateRoutine(organizationId);
  const deleteRoutine = useDeleteRoutine(organizationId);
  // Viewer shablonlarni ko'radi, lekin qo'shish/yoqish-o'chirish/tahrirlash yo'q.
  const isViewer = useIsViewer();

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const memberById = useMemo(() => {
    const map = new Map<number, TaskCardMember>();
    for (const m of membersDirectory) {
      const name = `${m.first_name} ${m.last_name}`;
      map.set(m.id, {
        id: String(m.id),
        name,
        initials: initialsOf(name),
        avatarUrl: m.telegram_avatar_url ?? undefined,
      });
    }
    return map;
  }, [membersDirectory]);

  const projectTabs = [
    { id: ALL_PROJECTS_ID, projectName: t("routines.allProjects"), projectTaskCount: routines.length },
    ...allProjects.map((project) => ({
      id: project.id,
      projectName: project.name,
      projectTaskCount: routines.filter((r) => String(r.project_id) === project.id).length,
    })),
  ];

  const filteredRoutines = routines.filter((r) => {
    const matchesProject = projectId === ALL_PROJECTS_ID || String(r.project_id) === projectId;
    const matchesFrequency = frequency === "all" || r.frequency === frequency;
    return matchesProject && matchesFrequency;
  });

  const toggleActive = (routine: RawTaskRoutine, active: boolean) => {
    updateRoutine.mutate(
      { projectId: String(routine.project_id), routineId: String(routine.id), payload: { active } },
      { onError: (err) => setErrorToast(getApiErrorMessage(err)) },
    );
  };

  const openEdit = (routine: RawTaskRoutine) => {
    setEditing({ projectId: String(routine.project_id), routine });
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingRoutine) return;
    deleteRoutine.mutate(
      { projectId: deletingRoutine.projectId, routineId: String(deletingRoutine.routine.id) },
      { onError: (err) => setErrorToast(getApiErrorMessage(err)) },
    );
    setDeletingRoutine(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionHeader
        title={t("routines.title")}
        subtitle={isRoutinesPending ? t("common.states.loading") : t("routines.count", { count: routines.length })}
        actions={
          !isViewer && (
            <CusButton
              leftIcon={<LuPlus size={16} />}
              onClick={() => {
                setEditing(null);
                setIsFormOpen(true);
              }}
              style={{ background: "var(--brand-default)", color: "var(--text-on-brand)" }}
            >
              {t("routines.addTask")}
            </CusButton>
          )
        }
      />

      <ProjectsTabs tabs={projectTabs} activeId={projectId} onChange={setProjectId} />

      <RoutineFrequencyTabs value={frequency} onChange={setFrequency} />

      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-2">
        {filteredRoutines.map((routine) => {
          const descriptionAudioFile = routine.files.find((f) => f.kind === "description_audio");
          const attachments = routine.files.filter((f) => f.kind === "attachment");
          const imageAttachments = attachments.filter((f) => f.mime_type.startsWith("image/"));
          const nonImageAttachments = attachments.filter((f) => !f.mime_type.startsWith("image/"));
          return (
            <TaskCardRoutine
              key={routine.id}
              title={routine.title}
              projectLabel={routine.projectName}
              priority={routine.priority}
              active={routine.active}
              readOnly={isViewer}
              onToggleActive={(active) => toggleActive(routine, active)}
              repeatLabel={formatRepeatLabel(routine)}
              nextRunLabel={formatNextRunLabel(routine)}
              onRepeatClick={() => setScheduleRoutine(routine)}
              members={routine.member_ids
                .map((id) => memberById.get(id))
                .filter((m): m is TaskCardMember => !!m)}
              expanded={expandedIds.has(routine.id)}
              onToggleExpanded={() => toggleExpanded(routine.id)}
              description={routine.description_type === "text" ? (routine.description ?? "") : ""}
              descriptionAudio={
                descriptionAudioFile ? { url: descriptionAudioFile.url, durationLabel: "0:00" } : undefined
              }
              subtasks={routine.subtasks.map((s) => ({ id: String(s.id), label: s.name, checked: s.checked }))}
              photos={imageAttachments.map((f) => ({ id: String(f.id), url: f.url }))}
              files={nonImageAttachments.map((f) => ({
                id: String(f.id),
                name: f.file_name,
                sizeLabel: `${Math.round(f.size_bytes / 1024)} KB`,
              }))}
              onDownloadFile={(id) => {
                const file = routine.files.find((f) => String(f.id) === id);
                if (file) window.open(file.url, "_blank", "noopener,noreferrer");
              }}
              onEdit={() => openEdit(routine)}
              onDelete={() => setDeletingRoutine({ projectId: String(routine.project_id), routine })}
            />
          );
        })}
      </div>

      <RoutineScheduleDialog
        routine={scheduleRoutine}
        onClose={() => setScheduleRoutine(null)}
        onEdit={
          isViewer
            ? undefined
            : (routine) => {
                setScheduleRoutine(null);
                openEdit(routine);
              }
        }
      />

      <RoutineFormDrawer
        variant="dialog"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        organizationId={organizationId}
        projects={allProjects}
        initial={editing}
        onError={setErrorToast}
      />

      <CusDialog
        open={deletingRoutine !== null}
        onClose={() => setDeletingRoutine(null)}
        title={t("routines.delete.title")}
        size="sm"
        centered
        footer={
          <>
            <CusButton variant="outline" onClick={() => setDeletingRoutine(null)}>
              {t("common.actions.cancel")}
            </CusButton>
            <CusButton
              onClick={confirmDelete}
              style={{ background: "var(--status-error-solid)", color: "var(--text-on-brand)" }}
            >
              {t("routines.delete.confirm")}
            </CusButton>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <span className="flex size-9 flex-none items-center justify-center rounded-avatar bg-warning-soft text-warning-strong">
            <LuTriangleAlert size={18} />
          </span>
          <p className="text-sm text-primary">
            {t("routines.delete.text", { title: deletingRoutine?.routine.title ?? "" })}
          </p>
        </div>
      </CusDialog>

      {errorToast && (
        <div
          className="fixed right-6 top-6 z-toast flex w-[360px] items-center gap-2 rounded-card border px-4 py-3 shadow-md"
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
