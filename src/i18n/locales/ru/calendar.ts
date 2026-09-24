// /calendar — hafta lentasi, kun kartasi, loyihalar ro'yxati.
const calendar = {
  title: "Календарь",
  pickDate: "Выберите дату",
  dayKind: {
    past: "Прошедший день",
    today: "Сегодня",
    future: "Запланировано",
  },
  dayInfo: {
    tasks: "Задачи",
    done: "Сдано — {{count}}",
    notDone: "Не выполнено — {{count}}",
    overdue: "Просрочено — {{count}}",
    left: "Осталось — {{count}}",
    planned: "Запланировано задач — {{count}}",
  },
  projects: {
    title: "Проекты",
    overdue: "Просрочено",
    overdueCount: "Просрочено {{count}}",
    completed: "Выполнено",
  },
  empty: {
    past: {
      title: "В этот день задач не было",
      hint: "Выберите другой день в календаре",
    },
    today: {
      title: "На сегодня задач нет",
      hint: "Свободный день — можно заняться планированием",
    },
    future: {
      title: "Задачи ещё не запланированы",
      hint: "Когда появятся задачи с этим сроком, они будут здесь",
    },
  },
};

export default calendar;
