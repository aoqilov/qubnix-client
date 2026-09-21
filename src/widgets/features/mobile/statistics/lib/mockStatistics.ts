import type {
  CompletionSummary,
  PriorityStat,
  ProjectStat,
  StatBarChartItem,
  StatsPeriod,
  StreakSummary,
} from "../types";

// Hali /statistics uchun real API ulanmagan — swagger yangilangach shu fayl
// backend so'roviga almashtiriladi, komponentlar (CompletionSummary / ProjectStat
// / ... shakli) o'zgarishsiz qoladi.

export const MOCK_PERIOD_RANGES: Record<StatsPeriod, string> = {
  week: "31.08 – 06.09.2026",
  month: "01.09 – 30.09.2026",
  year: "01.01 – 31.12.2026",
};

export const CHART_TITLES: Record<StatsPeriod, string> = {
  week: "ПО ДНЯМ НЕДЕЛИ",
  month: "ПО НЕДЕЛЯМ МЕСЯЦА",
  year: "ПО КВАРТАЛАМ",
};

export const MOCK_CHART_BUCKETS: Record<StatsPeriod, StatBarChartItem[]> = {
  week: [
    { label: "ПН", done: 7, notDone: 3 },
    { label: "ВТ", done: 8, notDone: 2 },
    { label: "СР", done: 5, notDone: 2 },
    { label: "ЧТ", done: 9, notDone: 3 },
    { label: "ПТ", done: 6, notDone: 2 },
    { label: "СБ", done: 1, notDone: 1, muted: true },
    { label: "ВС", done: 1, notDone: 0, muted: true },
  ],
  month: [
    { label: "1 нед.", done: 11, notDone: 3 },
    { label: "2 нед.", done: 14, notDone: 5 },
    { label: "3 нед.", done: 8, notDone: 3 },
    { label: "4 нед.", done: 12, notDone: 4 },
  ],
  year: [
    { label: "I кв.", done: 39, notDone: 13 },
    { label: "II кв.", done: 46, notDone: 15 },
    { label: "III кв.", done: 35, notDone: 12 },
    { label: "IV кв.", done: 51, notDone: 17 },
  ],
};

const BASE_COMPLETION: CompletionSummary = {
  percent: 20,
  taskCount: 6,
  trendDelta: 6,
  done: 6,
  completed: 1,
  inProgress: 1,
  overdue: 1,
};

function scaleCompletion(base: CompletionSummary, factor: number, percentDelta: number): CompletionSummary {
  return {
    percent: Math.min(100, base.percent + percentDelta),
    taskCount: Math.round(base.taskCount * factor),
    trendDelta: base.trendDelta + Math.round(percentDelta / 2),
    done: Math.round(base.done * factor),
    completed: Math.round(base.completed * factor),
    inProgress: Math.round(base.inProgress * factor),
    overdue: Math.round(base.overdue * factor),
  };
}

export const MOCK_COMPLETION: Record<StatsPeriod, CompletionSummary> = {
  week: BASE_COMPLETION,
  month: scaleCompletion(BASE_COMPLETION, 4, 14),
  year: scaleCompletion(BASE_COMPLETION, 38, 21),
};

const BASE_PROJECTS: ProjectStat[] = [
  { id: "redesign", name: "Редизайн", done: 0, total: 1 },
  { id: "client", name: "Клиент", done: 1, total: 1 },
];

function scaleProjects(base: ProjectStat[], factor: number): ProjectStat[] {
  return base.map((project) => {
    const total = Math.max(1, Math.round(project.total * factor));
    const done = Math.min(total, Math.round(project.done * factor));
    return { ...project, done, total };
  });
}

export const MOCK_PROJECTS: Record<StatsPeriod, ProjectStat[]> = {
  week: BASE_PROJECTS,
  month: scaleProjects(BASE_PROJECTS, 4),
  year: scaleProjects(BASE_PROJECTS, 40),
};

const BASE_PRIORITY: PriorityStat[] = [
  { level: "high", count: 5 },
  { level: "medium", count: 6 },
  { level: "low", count: 3 },
];

function scalePriority(base: PriorityStat[], factor: number): PriorityStat[] {
  return base.map((item) => ({ ...item, count: Math.round(item.count * factor) }));
}

export const MOCK_PRIORITY: Record<StatsPeriod, PriorityStat[]> = {
  week: BASE_PRIORITY,
  month: scalePriority(BASE_PRIORITY, 3),
  year: scalePriority(BASE_PRIORITY, 12),
};

export const MOCK_STREAK: Record<StatsPeriod, StreakSummary> = {
  week: {
    current: 9,
    windowDays: 14,
    activeDays: [true, false, true, false, false, true, true, true, true, true, true, true, true, true],
  },
  month: {
    current: 14,
    windowDays: 14,
    activeDays: Array(14).fill(true),
  },
  year: {
    current: 21,
    windowDays: 14,
    activeDays: Array(14).fill(true),
  },
};

export const MOCK_INSIGHT: Record<StatsPeriod, string> = {
  week: "Наблюдение: чаще всего задачи не выполняются по субботам — важные дела планируйте на этот день.",
  month: "Наблюдение: третья неделя месяца обычно самая слабая по выполнению — распределите нагрузку заранее.",
  year: "Наблюдение: четвёртый квартал — самый продуктивный, первый квартал проседает чаще всего.",
};
