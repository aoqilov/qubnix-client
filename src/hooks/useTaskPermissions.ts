import { WORKSPACE_ROLES } from "@/const/roles";
import { hasRole } from "@/components/shared/role-gate/RoleGate";
import { useSessionStore } from "@/store/session.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useOrganizationRole } from "@/queries/tasks.queries";
import type { RawProject } from "@/api/projects/projects.types";

/**
 * /tasks'dagi rol qoidalari — /settings/roles jadvali bilan mos:
 * - vazifa yaratish/tahrirlash/o'chirish: workspace owner/admin yoki shu loyihaning project_manager'i;
 * - xodim bo'yicha filtr: owner/admin/viewer yoki project_manager (personal'da yo'q);
 * - viewer: faqat ko'radi (status, subtask, fayl ham yopiq).
 * (Mobil FeatureTasks'da shu shartlarning o'z nusxasi bor — hozircha tegilmagan.)
 */
export function useTaskPermissions(organizationId: string | null, activeProject: RawProject | undefined) {
  const isPersonal = useWorkspaceStore((s) => s.selectedWorkspaceType) === "personal";
  const currentUserId = useSessionStore((s) => s.user?.id);
  const { data: workspaceRole } = useOrganizationRole(organizationId);
  const roles = workspaceRole ? [workspaceRole] : [];

  const isProjectManager = !!activeProject?.members.some(
    (m) => m.user_id === currentUserId && m.role === "project_manager",
  );

  return {
    isPersonal,
    currentUserId,
    isViewer: workspaceRole === WORKSPACE_ROLES.VIEWER,
    canManageTasks:
      hasRole(roles, [WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.ADMIN]) || isProjectManager,
    canFilterByEmployee:
      !isPersonal &&
      (hasRole(roles, [WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.ADMIN, WORKSPACE_ROLES.VIEWER]) ||
        isProjectManager),
  };
}
