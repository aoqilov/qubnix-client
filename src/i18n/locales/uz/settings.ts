import type ru from "../ru/settings";

const settings: typeof ru = {
  title: "Tashkilot: {{name}}",
  loadError: "Workspace ma'lumotlarini yuklab bo'lmadi. Sahifani yangilang.",
  manage: "BOSHQARUV",
  leave: "Workspace'dan chiqish",
  back: "Orqaga",
  pageTitle: "Sozlamalar",
  personalSpace: "Shaxsiy maydon",
  menu: {
    members: "Xodimlar",
    membersHint: "Rollar, taklifnomalar",
    roles: "Rollar",
    rolesHint: "Kim nima qila oladi",
    projects: "Loyihalar",
    projectsHint: "Statistika, yaratish, arxiv",
    memberStats: "Xodimlar statistikasi",
    memberStatsHint: "Kim qancha bajardi va kechikdi",
    routines: "Takrorlanuvchi vazifalar",
    routinesHint: "Kunlik, haftalik, oylik",
    reminders: "Eslatmalar",
    remindersHint: "Push va email",
    general: "Umumiy sozlamalar",
    generalHint: "Nomi, taklifnomalar, tarif",
  },
  reminders: {
    newTask: "Yangi vazifa",
    newTaskHint: "Yangi vazifa berilganda",
    deadline: "Vazifa muddati",
    deadlineHint: "Muddatdan 10 daqiqa oldin",
    taskCompleted: "Vazifa bajarildi",
    taskCompletedHint: "Vazifa bajarilgan deb belgilanganda",
    taskOverdue: "Vazifa muddati o'tdi",
    taskOverdueHint: "Vazifa muddati tugaganda",
    loadError: "Bildirishnoma sozlamalarini yuklab bo'lmadi.",
  },
  general: {
    orgName: "Tashkilot nomi",
    proMode: "PRO rejim",
    active: "Faol",
    remaining: "{{label}} qoldi — {{date}} gacha",
    extend: "Obunani uzaytirish",
  },
};

export default settings;
