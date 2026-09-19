import type { MemberPickerItem } from "@/components/shared/member-picker-drawer/MemberPickerDrawer";
import type { ProjectStatsItem } from "../types";

// Hali /projects uchun real API ulanmagan — swagger yangilangach shu fayl
// backend so'roviga almashtiriladi, ProjectStatsItem shakli o'zgarishsiz qoladi.

// Yangi proyekt yaratishda tanlash mumkin bo'lgan xodimlar ro'yxati.
export const MOCK_AVAILABLE_MEMBERS: MemberPickerItem[] = [
  { id: "1", name: "Малика Қодирова" },
  { id: "2", name: "Нигора Саидова" },
  { id: "3", name: "Тохир Каримов" },
  { id: "4", name: "Азиз Каримов" },
  { id: "5", name: "Дилноза Йусупова" },
];

export const MOCK_PROJECTS: ProjectStatsItem[] = [
  {
    id: "redizayn",
    name: "Редизайн",
    initials: "RE",
    done: 6,
    completed: 1,
    inProgress: 2,
    overdue: 1,
    percent: 20,
    members: [
      { id: "1", initials: "МК", name: "Малика Қодирова", role: "project_manager" },
      { id: "2", initials: "НС", name: "Нигора Саидова", role: "project_member" },
      { id: "3", initials: "ТК", name: "Тохир Каримов", role: "project_member" },
    ],
    overflowCount: 7,
  },
  {
    id: "pokupatel",
    name: "Покупатель",
    initials: "ПО",
    done: 4,
    completed: 2,
    inProgress: 1,
    overdue: 0,
    percent: 55,
    members: [
      { id: "4", initials: "АК", name: "Азиз Каримов", role: "project_manager" },
      { id: "5", initials: "ДЙ", name: "Дилноза Йусупова", role: "project_member" },
    ],
    overflowCount: 2,
  },
  {
    id: "vnutri",
    name: "Внутри",
    initials: "ВН",
    done: 3,
    completed: 1,
    inProgress: 3,
    overdue: 2,
    percent: 30,
    members: [{ id: "5", initials: "ДЙ", name: "Дилноза Йусупова", role: "project_manager" }],
  },
];
