import type {
  RawTask,
  RawTaskFile,
  RawTaskSubtask,
  TaskDescriptionInput,
  TaskDescriptionType,
  TaskPriority,
} from "@/api/tasks/tasks.types";

export type RoutineFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface RawTaskRoutine {
  id: number;
  organization_id: number;
  project_id: number;
  title: string;
  description: string | null;
  description_type: TaskDescriptionType;
  priority: TaskPriority;
  member_ids: number[];
  frequency: RoutineFrequency;
  weekdays: number[];
  month_days: number[];
  time_of_day: string;
  /** "HH:mm" — tugash soati. */
  end_time: string | null;
  timezone: string;
  start_date: string;
  end_date: string | null;
  next_run_at: string;
  last_run_at: string | null;
  active: boolean;
  created_by: number;
  files: RawTaskFile[];
  subtasks: RawTaskSubtask[];
  subtasks_count: number;
  created_at: string;
  updated_at: string;
}

/** `id` berilsa — mavjud subtask saqlanadi, berilmasa yangisi yaratiladi. Ro'yxat to'liq yuboriladi. */
export interface RoutineSubtaskInput {
  id?: number;
  name: string;
  checked?: boolean;
}

export interface RoutineMemberInput {
  user_id: number;
}

export interface CreateTaskRoutineRequest {
  name: string;
  description?: TaskDescriptionInput;
  priority?: TaskPriority;
  members?: RoutineMemberInput[];
  frequency: RoutineFrequency;
  weekdays?: number[];
  month_days?: number[];
  /** "HH:mm". */
  time: string;
  /** "HH:mm" — tugash soati, majburiy. */
  end_time: string;
  /** Hozircha faqat "Asia/Tashkent". */
  timezone?: string;
  /** YYYY-MM-DD. */
  start_date: string;
  end_date?: string | null;
  active?: boolean;
  /** Oldindan yuklangan attachment fayllar, 5 tagacha. */
  file_ids?: number[];
  subtasks?: RoutineSubtaskInput[];
}

export type UpdateTaskRoutineRequest = Partial<CreateTaskRoutineRequest>;

export interface RunTaskRoutineResult {
  task: RawTask;
  routine: RawTaskRoutine;
}
