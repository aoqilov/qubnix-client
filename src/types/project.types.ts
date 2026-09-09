export interface Project {
  id: string;
  name: string;
  workspaceId: string;
  memberIds: string[];
}

export interface CreateProjectRequest {
  name: string;
  memberIds: string[];
}
