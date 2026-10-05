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
    workspace: "Tashkilot",
    projects: "Loyihalar",
    tasks: "Vazifalar",
    calendar: "Kalendar",
    statistics: "Statistika",
    settings: "Sozlamalar",
    noWorkspace: "Doskadan tashkilotni tanlang",
    toDoska: "Doskani ochish",
    noProjects: "Loyihalar yo'q",
    collapse: "Menyuni yig'ish",
    expand: "Menyuni yoyish",
  },
  pwaUpdate: {
    title: "Yangi versiya tayyor",
    text: "Yangilanish yuklab olindi. Qo'llash uchun yangilang.",
    apply: "Yangilash",
    later: "Keyinroq",
  },
  header: {
    fullscreen: "To'liq ekran",
    exitFullscreen: "To'liq ekrandan chiqish",
  },
};

export default layout;
