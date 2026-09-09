export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId: string;
  projectId?: string;
  dueDate?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assigneeId: string;
  projectId?: string;
  dueDate?: string;
}
