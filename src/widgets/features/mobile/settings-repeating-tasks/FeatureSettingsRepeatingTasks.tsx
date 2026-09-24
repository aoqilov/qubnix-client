import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { LuPlus, LuTriangleAlert, LuX } from "react-icons/lu";
import { useWorkspaceStore } from "@/store/workspace.store";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import ProjectsTabs from "@/components/shared/project-tab/ProjectsTabs";
import TaskCardRoutine from "@/components/shared/task-card-routine/TaskCardRoutine";
import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";
import { SettingsBackHeader } from "@/widgets/features/mobile/settings/components/SettingsBackHeader";
import { RoutineFrequencyTabs } from "./components/RoutineFrequencyTabs";
import { RoutineFormDrawer, type RoutineFormInitial } from "./modals/RoutineFormDrawer";
import { RoutineScheduleDialog } from "./modals/RoutineScheduleDialog";
import {
  useOrgMembersDirectory,
  useOrgProjectsForRoutines,
  useDeleteRoutine,
  useRoutinesForProjects,
  useUpdateRoutine,
} from "./hooks/useApiRepeatingTasks";
import { formatNextRunLabel, formatRepeatLabel } from "./lib/formatRoutine";
import type { RoutineFilter } from "./types";
import type { RawTaskRoutine } from "@/api/task-routines/task-routines.types";

const ALL_PROJECTS_ID = "all";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

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
    const t = setTimeout(() => setErrorToast(null), 4000);
    return () => clearTimeout(t);
  }, [errorToast]);

  const { data: allProjects = [] } = useOrgProjectsForRoutines(organizationId);
  // Personal workspace'da boshqa xodim yo'q — kartalardagi avatarlar uchun ro'yxat so'ralmaydi.
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const { data: membersDirectory = [] } = useOrgMembersDirectory(organizationId, !isPersonal);
  const { routines, isPending: isRoutinesPending } = useRoutinesForProjects(
    organizationId,
    allProjects,
  );
  const updateRoutine = useUpdateRoutine(organizationId);
  const deleteRoutine = useDeleteRoutine(organizationId);

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

  const projectTabs = useMemo(
    () => [
      {
        id: ALL_PROJECTS_ID,
        projectName: t("routines.allProjects"),
        projectTaskCount: routines.length,
      },
      ...allProjects.map((project) => ({
        id: project.id,
        projectName: project.name,
        projectTaskCount: routines.filter((r) => String(r.project_id) === project.id).length,
      })),
    ],
    [allProjects, routines],
  );

  const filteredRoutines = routines.filter((r) => {
    const matchesProject = projectId === ALL_PROJECTS_ID || String(r.project_id) === projectId;
    const matchesFrequency = frequency === "all" || r.frequency === frequency;
    return matchesProject && matchesFrequency;
  });

  const toggleActive = (routine: RawTaskRoutine, active: boolean) => {
    updateRoutine.mutate(
      {
        projectId: String(routine.project_id),
        routineId: String(routine.id),
        payload: { active },
      },
      { onError: (err) => setErrorToast(getApiErrorMessage(err)) },
    );
  };

  const confirmDelete = () => {
    if (!deletingRoutine) return;
    deleteRoutine.mutate(
      {
        projectId: deletingRoutine.projectId,
        routineId: String(deletingRoutine.routine.id),
      },
      { onError: (err) => setErrorToast(getApiErrorMessage(err)) },
    );
    setDeletingRoutine(null);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsBackHeader title={t("routines.title")} />

      <p className="-mt-2 text-sm font-semibold text-brand">
        {isRoutinesPending
          ? t("common.states.loading")
          : t("routines.count", { count: routines.length })}
      </p>

      <ProjectsTabs tabs={projectTabs} activeId={projectId} onChange={setProjectId} />

      <RoutineFrequencyTabs value={frequency} onChange={setFrequency} />

      <CusButton
        variant="plain"
        className="w-full"
        style={{
          height: "48px",
          width: "100%",
          border: "1px dashed var(--border-default)",
          borderRadius: "var(--radius-card)",
          color: "var(--brand-default)",
          fontWeight: 600,
        }}
        leftIcon={<LuPlus size={16} />}
        onClick={() => {
          setEditing(null);
          setIsFormOpen(true);
        }}
      >
        {t("routines.addTask")}
      </CusButton>

      <div className="flex flex-col gap-3">
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
                descriptionAudioFile
                  ? { url: descriptionAudioFile.url, durationLabel: "0:00" }
                  : undefined
              }
              subtasks={routine.subtasks.map((s) => ({
                id: String(s.id),
                label: s.name,
                checked: s.checked,
              }))}
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
                const file = routine.files.find((f) => String(f.id) === id);
                if (file) window.open(file.url, "_blank", "noopener,noreferrer");
              }}
              onEdit={() => {
                setEditing({ projectId: String(routine.project_id), routine });
                setIsFormOpen(true);
              }}
              onDelete={() =>
                setDeletingRoutine({
                  projectId: String(routine.project_id),
                  routine,
                })
              }
            />
          );
        })}
      </div>

      <RoutineScheduleDialog
        routine={scheduleRoutine}
        onClose={() => setScheduleRoutine(null)}
        onEdit={(routine) => {
          setScheduleRoutine(null);
          setEditing({ projectId: String(routine.project_id), routine });
          setIsFormOpen(true);
        }}
      />

      <RoutineFormDrawer
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
              style={{
                background: "var(--status-error-solid)",
                color: "var(--text-on-brand)",
              }}
            >
              {t("routines.delete.confirm")}
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
          <p style={{ fontSize: 14, color: "var(--text-primary)" }}>
            {t("routines.delete.text", { title: deletingRoutine?.routine.title ?? "" })}
          </p>
        </div>
      </CusDialog>

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
