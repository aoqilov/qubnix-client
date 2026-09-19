import type { DailyStatsRow, MemberStatsRow, StatsPeriod } from "../types";

// Hali /statistics/members uchun real API ulanmagan — swagger yangilangach
// shu fayl backend so'roviga almashtiriladi, komponentlar (MemberStatsRow /
// DailyStatsRow shakli) o'zgarishsiz qoladi.

export interface StatsMember {
  id: string;
  name: string;
}

export const MOCK_PERIOD_RANGES: Record<StatsPeriod, string> = {
  "7": "31.08 – 06.09.2026",
  "15": "23.08 – 06.09.2026",
  "30": "08.08 – 06.09.2026",
};

const BASE_MEMBER_STATS: MemberStatsRow[] = [
  {
    memberId: "1",
    name: "Сухроб Шакиров",
    done: 6,
    completed: 1,
    inProgress: 2,
    overdue: 1,
    percent: 20,
  },
  {
    memberId: "2",
    name: "Dilnoza Yusupova",
    done: 6,
    completed: 1,
    inProgress: 2,
    overdue: 1,
    percent: 20,
  },
  {
    memberId: "3",
    name: "Aziz Karimov",
    done: 4,
    completed: 2,
    inProgress: 1,
    overdue: 0,
    percent: 45,
  },
  {
    memberId: "4",
    name: "Nigora Saidova",
    done: 8,
    completed: 0,
    inProgress: 3,
    overdue: 2,
    percent: 35,
  },
  {
    memberId: "5",
    name: "Jasur Toxtayev",
    done: 3,
    completed: 1,
    inProgress: 1,
    overdue: 2,
    percent: 15,
  },
];

export const MOCK_STATS_MEMBERS: StatsMember[] = BASE_MEMBER_STATS.map((row) => ({
  id: row.memberId,
  name: row.name,
}));

function scaleMemberStats(rows: MemberStatsRow[], factor: number, percentDelta: number): MemberStatsRow[] {
  return rows.map((row) => ({
    ...row,
    done: Math.round(row.done * factor),
    completed: Math.round(row.completed * factor),
    inProgress: Math.round(row.inProgress * factor),
    overdue: Math.round(row.overdue * factor),
    percent: Math.min(100, row.percent + percentDelta),
  }));
}

export const MOCK_MEMBER_STATS: Record<StatsPeriod, MemberStatsRow[]> = {
  "7": BASE_MEMBER_STATS,
  "15": scaleMemberStats(BASE_MEMBER_STATS, 2, 10),
  "30": scaleMemberStats(BASE_MEMBER_STATS, 3.5, 18),
};

const DAY_LABELS_7 = ["31.08", "01.09", "02.09", "03.09", "04.09", "05.09", "06.09"];

function buildDailyStats(dayLabels: string[]): DailyStatsRow[] {
  return dayLabels.map((date, index) => ({
    date,
    done: 1 + (index % 3),
    completed: index % 2,
    inProgress: 1 + (index % 2),
    overdue: index % 4 === 0 ? 1 : 0,
  }));
}

function extendDayLabels(days: number): string[] {
  // 06.09.2026 dan orqaga qarab kunlarni hisoblaydi — davr oxiri barcha
  // period'larda bir xil (faqat boshlanish sanasi siljiydi).
  const end = new Date(Date.UTC(2026, 8, 6));
  const labels: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);
    labels.push(
      `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
    );
  }
  return labels;
}

export const MOCK_DAILY_STATS: Record<StatsPeriod, DailyStatsRow[]> = {
  "7": buildDailyStats(DAY_LABELS_7),
  "15": buildDailyStats(extendDayLabels(15)),
  "30": buildDailyStats(extendDayLabels(30)),
};
