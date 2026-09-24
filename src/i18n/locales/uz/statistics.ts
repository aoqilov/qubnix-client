import type ru from "../ru/statistics";

const statistics: typeof ru = {
  title: "Statistika",
  loadError: "Statistikani yuklab bo'lmadi.",
  period: {
    week: "Hafta",
    month: "Oy",
  },
  completion: {
    title: "Bajarilish foizi",
  },
  chart: {
    byWeekday: "HAFTA KUNLARI BO'YICHA",
    byWeek: "OY HAFTALARI BO'YICHA",
    weekShort: "{{n}}-hafta",
    done: "Topshirildi",
    notDone: "Bajarilmadi",
    tooltipDone: "{{count}} ta topshirildi",
    tooltipNotDone: "{{count}} ta bajarilmadi",
    tooltipTotal: "jami {{count}} ta",
  },
  projects: {
    title: "Loyihalar bo'yicha",
  },
  priority: {
    title: "Muhimlik",
  },
  streak: {
    title: "Kunlik ketma-ketlik",
    lastDays: "oxirgi {{label}}",
  },
};

export default statistics;
