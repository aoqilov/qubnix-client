import type ru from "../ru/doska";

const doska: typeof ru = {
  title: "Qayerda ishlaymiz?",
  sections: {
    personal: "Shaxsiy",
    organizations: "Tashkilotlar",
  },
  listError: "Ro'yxatni yuklab bo'lmadi. Sahifani yangilang.",
  emptyOrganizations: "Siz hali hech qaysi tashkilotga a'zo emassiz",
  personal: {
    title: "Shaxsiy vazifalar",
    today: "Bugun {{label}}",
  },
  addOrganization: "Yangi tashkilot",
  invitations: {
    button: "Taklifnomalar",
    title: "Taklifnomalar",
    loadError: "Taklifnomalarni yuklab bo'lmadi.",
    empty: "Hozircha yangi taklifnomalar yo'q",
    from: "{{name}} dan",
    daysAgo: "{{count}} kun oldin",
    projects: "Loyihalar ({{count}})",
    reject: "Rad etish",
    accept: "Qabul qilish",
  },
};

export default doska;
