import type { ReminderItem } from "../types";

// Hali /settings/reminders uchun real API ulanmagan — swagger yangilangach
// shu fayl backend so'roviga almashtiriladi, ReminderItem shakli o'zgarishsiz qoladi.
export const MOCK_WORKSPACE_NAME = "Synapse";

export const MOCK_REMINDERS: ReminderItem[] = [
  {
    id: "new-task",
    title: "Когда дается новая задача",
    description: "Push-уведомление",
    enabled: true,
  },
  {
    id: "project-management",
    title: "Ведение проекта",
    description: "Push-уведомление",
    enabled: true,
  },
  {
    id: "performance",
    title: "Успеваемость",
    description: "Push-уведомление",
    enabled: true,
  },
];
