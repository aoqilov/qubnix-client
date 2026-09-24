import type { Pagination } from "@/types/common";

export type TaskStatus = "todo" | "in_progress" | "done" | "not_done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskDescriptionType = "text" | "audio";
export type TaskFileKind = "attachment" | "description_audio";

export interface RawTaskMember {
  user_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  telegram_username: string | null;
  telegram_avatar_url: string | null;
}

export interface RawTaskFile {
  id: number;
  kind: TaskFileKind;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
}

export interface RawTaskSubtask {
  id: number;
  name: string;
  checked: boolean;
}

/** Backend /api/v1/organizations/{organizationID}/projects/{project_id}/tasks* javoblaridagi xom shakl. */
export interface RawTask {
  id: number;
  organization_id: number;
  project_id: number;
  name: string;
  title: string;
  description: string | null;
  description_type: TaskDescriptionType;
  status: TaskStatus;
  priority: TaskPriority;
  start_at: string | null;
  due_at: string | null;
  completed_at: string | null;
  created_by: number;
  parent_task_id: number | null;
  routine_id: number | null;
  members: RawTaskMember[];
  files: RawTaskFile[];
  subtasks: RawTaskSubtask[];
  subtasks_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListTasksParams {
  page?: number;
  /** 1–1000, default 20. */
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sort_by?: "priority" | "deadline" | "created_at";
  /** Vergul bilan ajratilgan user id'lar. */
  member_ids?: string;
  /** YYYY-MM-DD. */
  date?: string;
  from?: string;
  to?: string;
}

/** Status bo'yicha vazifalar soni — calendar/statistics endpointlarida umumiy shakl. */
export interface TaskStatusTotals {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  /** Muddati o'tgan va bajarilmagan — UI'da "Просрочено". */
  not_done: number;
}

/** GET /organizations/{id}/tasks/calendar — bitta sana (due_at, Asia/Tashkent) bo'yicha. */
export interface TaskCalendarDay {
  date: string;
  totals: TaskStatusTotals;
  projects: { id: number; name: string; totals: TaskStatusTotals }[];
}

export type TaskStatisticsType = "weekly" | "monthly";

/**
 * GET /organizations/{id}/tasks/statistics — faqat joriy foydalanuvchiga
 * biriktirilgan vazifalar. weekly → kunlik, monthly → haftalik timeline.
 */
export interface TaskStatistics {
  type: TaskStatisticsType;
  date: string;
  totals: TaskStatusTotals;
  timeline: { start_date: string; end_date: string; totals: TaskStatusTotals }[];
  projects: { id: number; name: string; totals: TaskStatusTotals }[];
  priorities: { priority: TaskPriority; totals: TaskStatusTotals }[];
}

export interface ListTasksResponse {
  tasks: RawTask[];
  pagination: Pagination;
}

export interface TaskMemberInput {
  user_id: number;
}

export interface TaskSubtaskInput {
  name: string;
  checked?: boolean;
}

/** `description` matn sifatida yoki audio fayl (avval yuklangan `file_id`) sifatida yuborilishi mumkin. */
export type TaskDescriptionInput =
  | string
  | null
  | { type: "text"; text?: string | null }
  | { type: "audio"; file_id: number };

export interface CreateTaskRequest {
  name?: string;
  title?: string;
  members?: TaskMemberInput[];
  description?: TaskDescriptionInput;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_at?: string | null;
  due_at?: string | null;
  /** Eng ko'p 5 ta, avval `taskFilesApi.upload` orqali yuklangan fayl id'lari. */
  file_ids?: number[];
  subtasks?: TaskSubtaskInput[];
}

export type UpdateTaskRequest = CreateTaskRequest;
