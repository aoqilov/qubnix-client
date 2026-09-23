import type { RawTask, TaskPriority } from "@/api/tasks/tasks.types";

export type RoutineFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface RawTaskRoutine {
  id: number;
  organization_id: number;
  project_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  member_ids: number[];
  frequency: RoutineFrequency;
  weekdays: number[];
  month_days: number[];
  time_of_day: string;
  timezone: string;
  start_date: string;
  end_date: string | null;
  next_run_at: string;
  last_run_at: string | null;
  active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface RoutineMemberInput {
  user_id: number;
}

export interface CreateTaskRoutineRequest {
  name: string;
  description?: string | null;
  priority?: TaskPriority;
  members?: RoutineMemberInput[];
  frequency: RoutineFrequency;
  weekdays?: number[];
  month_days?: number[];
  /** "HH:mm". */
  time: string;
  /** Hozircha faqat "Asia/Tashkent". */
  timezone?: string;
  /** YYYY-MM-DD. */
  start_date: string;
  end_date?: string | null;
  active?: boolean;
}

export type UpdateTaskRoutineRequest = Partial<CreateTaskRoutineRequest>;

export interface RunTaskRoutineResult {
  task: RawTask;
  routine: RawTaskRoutine;
}
