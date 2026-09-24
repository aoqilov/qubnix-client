import type ru from "../ru/calendar";

const calendar: typeof ru = {
  title: "Kalendar",
  pickDate: "Sanani tanlang",
  dayKind: {
    past: "O'tgan kun",
    today: "Bugun",
    future: "Rejalashtirilgan",
  },
  dayInfo: {
    tasks: "Vazifalar",
    done: "Topshirildi — {{count}}",
    notDone: "Bajarilmadi — {{count}}",
    overdue: "Muddati o'tgan — {{count}}",
    left: "Qoldi — {{count}}",
    planned: "Rejalashtirilgan vazifalar — {{count}}",
  },
  projects: {
    title: "Loyihalar",
    overdue: "Muddati o'tgan",
    overdueCount: "Muddati o'tgan {{count}}",
    completed: "Bajarildi",
  },
  empty: {
    past: {
      title: "Bu kunda vazifalar bo'lmagan",
      hint: "Kalendardan boshqa kunni tanlang",
    },
    today: {
      title: "Bugunga vazifa yo'q",
      hint: "Bo'sh kun — rejalashtirish bilan shug'ullansa bo'ladi",
    },
    future: {
      title: "Vazifalar hali rejalashtirilmagan",
      hint: "Shu muddatli vazifalar paydo bo'lganda, ular shu yerda chiqadi",
    },
  },
};

export default calendar;
