// Workspace darajasidagi rollar — umumiy workspace bo'yicha vakolat.
export const WORKSPACE_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  VIEWER: "viewer",
} as const;

export type WorkspaceRole =
  (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES];

// Loyiha (project) darajasidagi rollar — workspace ichidagi aniq loyihaga xos vakolat.
export const PROJECT_ROLES = {
  PROJECT_MANAGER: "project_manager",
  PROJECT_MEMBER: "project_member",
} as const;

export type ProjectRole = (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES];
