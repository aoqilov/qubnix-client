import {
  WORKSPACE_ROLES,
  PROJECT_ROLES,
  type WorkspaceRole,
  type ProjectRole,
} from "@/const/roles";

// Yuqoridan pastga qarab: kattaroq daraja kichigining vakolatini ham qamrab oladi.
const WORKSPACE_LEVEL: Record<WorkspaceRole, number> = {
  [WORKSPACE_ROLES.OWNER]: 4,
  [WORKSPACE_ROLES.ADMIN]: 3,
  [WORKSPACE_ROLES.MEMBER]: 2,
  [WORKSPACE_ROLES.VIEWER]: 1,
};

const PROJECT_LEVEL: Record<ProjectRole, number> = {
  [PROJECT_ROLES.PROJECT_MANAGER]: 2,
  [PROJECT_ROLES.PROJECT_MEMBER]: 1,
};

/**
 * const isAtLeast = useWorkspaceRole(currentWorkspaceRole);
 * if (isAtLeast(WORKSPACE_ROLES.ADMIN)) { ... }
 */
export function useWorkspaceRole(currentRole: WorkspaceRole) {
  return (required: WorkspaceRole) =>
    WORKSPACE_LEVEL[currentRole] >= WORKSPACE_LEVEL[required];
}

/**
 * const isAtLeast = useProjectRole(currentProjectRole);
 * if (isAtLeast(PROJECT_ROLES.PROJECT_MANAGER)) { ... }
 */
export function useProjectRole(currentRole: ProjectRole) {
  return (required: ProjectRole) =>
    PROJECT_LEVEL[currentRole] >= PROJECT_LEVEL[required];
}
