export interface Employee {
  id: string;
  fullName: string;
  roleId: string;
  workspaceId: string;
  avatarUrl?: string;
}

export interface InviteEmployeeRequest {
  phoneOrUsername: string;
  roleId: string;
}
