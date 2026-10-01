import { useState } from "react";

export type TasksViewMode = "list" | "board";

const STORAGE_KEY = "qubnix_tasks_view_mode";

function readStored(): TasksViewMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === "board" ? "board" : "list";
  } catch {
    // localStorage yopiq bo'lishi mumkin (private rejim) — standart ko'rinish.
    return "list";
  }
}

/** Ro'yxat / kanban tanlovi — sahifadan chiqib qaytganda va qayta yuklanganda saqlanib qoladi. */
export function useTasksViewMode() {
  const [viewMode, setViewModeState] = useState<TasksViewMode>(readStored);

  const setViewMode = (mode: TasksViewMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Saqlab bo'lmasa — tanlov faqat shu sessiyada qoladi.
    }
    setViewModeState(mode);
  };

  return [viewMode, setViewMode] as const;
}
