import type { TaskCardMember } from "@/components/shared/task-card/mini-components/TaskAvatarGroup";

/** Backend payload shakli: { data: { name, members: [{ user_id, role }] } }. */
export type ProjectMemberRole = "project_manager" | "project_member";

export interface ProjectMember extends TaskCardMember {
  role: ProjectMemberRole;
}

export interface ProjectStatsItem {
  id: string;
  name: string;
  initials: string;
  done: number;
  completed: number;
  inProgress: number;
  overdue: number;
  percent: number;
  members: ProjectMember[];
  overflowCount?: number;
  archived?: boolean;
}

export interface ProjectFormMember {
  userId: string;
  role: ProjectMemberRole;
}

export interface ProjectFormInput {
  name: string;
  members: ProjectFormMember[];
}
