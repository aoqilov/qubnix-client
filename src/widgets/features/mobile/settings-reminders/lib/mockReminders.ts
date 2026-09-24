import type { ReminderItem } from "../types";

// Hali /settings/reminders uchun real API ulanmagan — swagger yangilangach
// shu fayl backend so'roviga almashtiriladi, ReminderItem shakli o'zgarishsiz qoladi.
export const MOCK_REMINDERS: ReminderItem[] = [
  {
    id: "new-task",
    titleKey: "settings.reminders.newTask",
    descriptionKey: "settings.reminders.push",
    enabled: true,
  },
  {
    id: "project-management",
    titleKey: "settings.reminders.projectManagement",
    descriptionKey: "settings.reminders.push",
    enabled: true,
  },
  {
    id: "performance",
    titleKey: "settings.reminders.performance",
    descriptionKey: "settings.reminders.push",
    enabled: true,
  },
];
