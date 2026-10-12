import { useState } from "react";
import { WORKSPACE_ROLES } from "@/const/roles";
import { hasRole } from "@/components/shared/role-gate/RoleGate";
import type { PickableProject } from "@/components/shared/project-picker/ProjectPickerDrawer";
import type { TaskModalAddValues } from "@/components/shared/task-modals/TaskModalAdd";
import { useTaskSubmit } from "@/hooks/useTaskSubmit";
import { useAllProjects, useOrganizationRole, useProjectMembersForTask } from "@/queries/tasks.queries";
import { useSessionStore } from "@/store/session.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getApiErrorMessage } from "@/utils/apiErrorMessage";
import { getDayKind, toApiDate } from "@/utils/apiDate";

interface UseCalendarAddTaskOptions {
  organizationId: string | null;
  /** /calendar'da tanlangan kun. */
  date: Date;
  /** Yaratish xatosi (toast uchun). Xato baribir qayta tashlanadi — modal ochiq qoladi. */
  onError: (message: string) => void;
}

/**
 * /calendar'dagi "Добавить задачу": loyiha tanlash → vazifa modali (tanlangan kun bilan).
 * Workspace owner/admin hamma loyihaga, project_manager faqat o'z loyihalariga qo'sha oladi;
 * o'tgan kunga qo'shilmaydi (/tasks'dagi kabi faqat ko'rish). Mobil va desktop umumiy.
 */
export function useCalendarAddTask({ organizationId, date, onError }: UseCalendarAddTaskOptions) {
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const currentUserId = useSessionStore((s) => s.user?.id);
  const { data: workspaceRole } = useOrganizationRole(organizationId);
  const allProjects = useAllProjects(organizationId).data ?? [];

  const isOwnerOrAdmin = hasRole(workspaceRole ? [workspaceRole] : [], [
    WORKSPACE_ROLES.OWNER,
    WORKSPACE_ROLES.ADMIN,
  ]);
  const manageableProjects: PickableProject[] = (
    isOwnerOrAdmin
      ? allProjects
      : allProjects.filter((p) =>
          p.members.some((m) => m.user_id === currentUserId && m.role === "project_manager"),
        )
  ).map((p) => ({ id: String(p.id), name: p.name }));
  const canAdd = getDayKind(date) !== "past" && manageableProjects.length > 0;

  const [isPickerOpen, setPickerOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [projectId, setProjectId] = useState("");

  const { data: members = [], isPending: isMembersPending } = useProjectMembersForTask(
    organizationId,
    projectId,
    !isPersonal && isAddOpen,
  );
  const { addTask } = useTaskSubmit({ organizationId, projectId, isPersonal, currentUserId });

  function openModal(id: string) {
    setProjectId(id);
    setPickerOpen(false);
    setAddOpen(true);
  }

  function start() {
    // Bitta loyiha bo'lsa — tanlash keraksiz.
    if (manageableProjects.length === 1) openModal(manageableProjects[0].id);
    else setPickerOpen(true);
  }

  async function submit(values: TaskModalAddValues) {
    try {
      await addTask(values);
    } catch (err) {
      onError(getApiErrorMessage(err));
      throw err;
    }
  }

  return {
    canAdd,
    start,
    picker: {
      open: isPickerOpen,
      onClose: () => setPickerOpen(false),
      projects: manageableProjects,
      onSelect: (project: PickableProject) => openModal(project.id),
    },
    modal: {
      open: isAddOpen,
      onClose: () => setAddOpen(false),
      onSubmit: submit,
      members,
      isLoadingMembers: isMembersPending,
      hideMembers: isPersonal,
      initialDate: toApiDate(date),
    },
  };
}
