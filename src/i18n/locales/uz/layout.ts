import type ru from "../ru/layout";

const layout: typeof ru = {
  nav: {
    doska: "Doska",
    profile: "Profil",
    tasks: "VAZIFALAR",
    calendar: "KALENDAR",
    statistics: "STATISTIKA",
    settings: "SOZLAMALAR",
  },
  authError: {
    title: "Kirib bo'lmadi",
    text: "Telegram orqali kirishni tasdiqlab bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.",
  },
  sidebar: {
    main: "Asosiy",
    dashboard: "Doska",
    profile: "Profil",
    workspace: "Workspace",
    projects: "Loyihalar",
    today: "Bugun",
    calendar: "Kalendar",
    statistics: "Statistika",
    noWorkspace: "Doskadan tashkilotni tanlang",
    toDoska: "Doskani ochish",
    noProjects: "Loyihalar yo'q",
    collapse: "Menyuni yig'ish",
    expand: "Menyuni yoyish",
  },
};

export default layout;
