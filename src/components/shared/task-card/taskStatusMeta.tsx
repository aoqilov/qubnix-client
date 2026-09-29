import i18n from "@/i18n";
import type { ReactNode } from "react";
import { LuCircle, LuCircleCheck, LuCircleX, LuLoaderCircle } from "react-icons/lu";
import type { TaskStatusColor } from "./mini-components/TaskStatusLabel";

/**
 * Vazifa statuslari — UI id (assigned/in_progress/done/failed), matn kaliti, rang va backend
 * `task_counts`/`status` kaliti. Desktop /tasks shu yerdan oladi (mobil FeatureTasks'da o'z nusxasi).
 */
export const TASK_STATUS_META = [
  { id: "assigned", labelKey: "common.taskStatus.todo" as const, color: "gray" as const, countKey: "todo" as const },
  { id: "in_progress", labelKey: "common.taskStatus.in_progress" as const, color: "brand" as const, countKey: "in_progress" as const },
  { id: "done", labelKey: "common.taskStatus.done" as const, color: "success" as const, countKey: "done" as const },
  { id: "failed", labelKey: "common.taskStatus.not_done" as const, color: "error" as const, countKey: "not_done" as const },
];

export type TaskStatusMeta = (typeof TASK_STATUS_META)[number];

export const TASK_SORT_KEYS = ["deadline", "priority", "created"] as const;
export type TaskSortKey = (typeof TASK_SORT_KEYS)[number];

export const TASK_SORT_TO_API = {
  deadline: "deadline",
  priority: "priority",
  created: "created_at",
} as const;

const STATUS_ICON: Record<string, ReactNode> = {
  assigned: <LuCircle size={14} />,
  in_progress: <LuLoaderCircle size={14} />,
  done: <LuCircleCheck size={14} />,
  failed: <LuCircleX size={14} />,
};

const STATUS_ICON_COLOR: Record<TaskStatusColor, string> = {
  gray: "var(--text-secondary)",
  brand: "var(--brand-default)",
  success: "var(--status-success-solid)",
  error: "var(--status-error-solid)",
};

/** Status menyusi (CusMenuList) — matn render paytida olinadi, til almashsa yangilanadi. */
export const buildTaskStatusMenuOptions = () =>
  TASK_STATUS_META.map((meta) => ({
    id: meta.id,
    label: i18n.t(meta.labelKey),
    icon: STATUS_ICON[meta.id],
    iconColor: STATUS_ICON_COLOR[meta.color],
  }));
