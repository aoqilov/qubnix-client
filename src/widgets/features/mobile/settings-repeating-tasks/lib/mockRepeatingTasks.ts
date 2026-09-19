import type { RoutineTask } from "../types";

// Hali /tasks/routines uchun real API ulanmagan — swagger yangilangach shu
// fayl backend so'roviga almashtiriladi, RoutineTask shakli o'zgarishsiz qoladi.

export interface RoutineProject {
  id: string;
  name: string;
}

export const MOCK_ROUTINE_PROJECTS: RoutineProject[] = [
  { id: "redizayn", name: "Редизайн" },
  { id: "pokupatel", name: "Покупатель" },
  { id: "vnutri", name: "Внутри" },
];

export const MOCK_ROUTINE_TASKS: RoutineTask[] = [
  {
    id: "1",
    title: "Отчет по успеваемости",
    projectId: "redizayn",
    projectLabel: "Редизайн",
    frequency: "daily",
    active: true,
    repeatLabel: "Каждый день 09:00",
    nextRunLabel: "Следующее завтра в 09:00",
    members: [
      { id: "1", initials: "МК", name: "Малика Қодирова" },
      { id: "2", initials: "НС", name: "Нигора Саидова" },
      { id: "3", initials: "ТК", name: "Тохир Каримов" },
    ],
    overflowCount: 7,
  },
  {
    id: "2",
    title: "Сбор отзывов клиентов",
    projectId: "pokupatel",
    projectLabel: "Покупатель",
    frequency: "weekly",
    active: true,
    repeatLabel: "Каждую неделю в Пн 10:00",
    nextRunLabel: "Следующее в понедельник в 10:00",
    members: [
      { id: "4", initials: "АК", name: "Азиз Каримов" },
      { id: "5", initials: "ДЙ", name: "Дилноза Йусупова" },
    ],
    overflowCount: 2,
  },
  {
    id: "3",
    title: "Отчет по бюджету",
    projectId: "vnutri",
    projectLabel: "Внутри",
    frequency: "monthly",
    active: false,
    repeatLabel: "Каждый месяц, 1 число 09:00",
    nextRunLabel: "Следующее 1 октября в 09:00",
    members: [{ id: "5", initials: "ДЙ", name: "Дилноза Йусупова" }],
  },
  {
    id: "4",
    title: "Годовой аудит проекта",
    projectId: "redizayn",
    projectLabel: "Редизайн",
    frequency: "yearly",
    active: true,
    repeatLabel: "Каждый год, 1 января 09:00",
    nextRunLabel: "Следующее 01.01.2027 в 09:00",
    members: [
      { id: "1", initials: "МК", name: "Малика Қодирова" },
      { id: "3", initials: "ТК", name: "Тохир Каримов" },
    ],
  },
];
